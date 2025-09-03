import { Component, inject} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormRecord, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AboutMyselfService} from '../../../data/services/about-myself.service';
import {KeyValuePipe} from '@angular/common';

enum ReceiverTypePhone {
  OPPO = 'OPPO',
  SPACEX = 'SPACEX',
  IPHONE = 'IPHONE',
}

enum ReceiverTypeOS {
  IOS = 'IOS',
  ANDROID = 'ANDROID',
}

enum ReceiverTypeWarrantyIos {
  MONTH1 = 'MONTH1',
  MONTH3 = 'MONTH3',
  MONTH6 = 'MONTH6',
}

enum ReceiverTypePerson {
  PERSON = 'PERSON',
  LEGAL = 'LEGAL',
}

interface Address {
  city?: string
  street?: string
  home?: number
  apartment?: number
  phone?: number
}

function getAddressForm(initialValue: Address = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValue.city ?? ''),
    street: new FormControl<string>(initialValue.street ?? ''),
    home: new FormControl<number | null>(initialValue.home ?? null),
    apartment: new FormControl<number | null>(initialValue.apartment ?? null),
    phone: new FormControl<number | null>(initialValue.phone ?? null,
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10)
      ])
    })
}

interface Feature {
  code: string;    // Уникальный код фичи, напр. 'lift'
  label: string;   // человеко читаемое название
  value: boolean;  // включена/выключена
}

@Component({
  selector: 'app-about-myself',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    KeyValuePipe
  ],
  templateUrl: './about-myself.html',
  styleUrl: './about-myself.scss'
})
export class AboutMyself {
  ReceiverTypePhone = ReceiverTypePhone;
  ReceiverTypeOS = ReceiverTypeOS;
  ReceiverTypeWarrantyIos = ReceiverTypeWarrantyIos;
  ReceiverTypePerson = ReceiverTypePerson;

  aboutMyselfService = inject(AboutMyselfService)
  features: Feature[] = []

  form = new FormGroup({
    personInfo: new FormGroup({
      name: new FormControl<string>('', Validators.required),
      lastName: new FormControl<string>(''),
      type: new FormControl<ReceiverTypePerson>(ReceiverTypePerson.PERSON),
      iin: new FormControl<string>(''),
      iinDisable: new FormControl<string>({value: 'ТОЛЬКО ЮР. ЛИЦА!', disabled: true}),
    }),
    description: new FormControl<string>(''),
    info: new FormGroup({
      typePhone: new FormControl<ReceiverTypePhone>(ReceiverTypePhone.OPPO),
      typeOS: new FormControl<ReceiverTypeOS>(ReceiverTypeOS.IOS),
      date: new FormControl<string>(''),
      warranty: new FormControl<ReceiverTypeWarrantyIos>(ReceiverTypeWarrantyIos.MONTH1),
      warrantyAndroid: new FormControl<string>({value: 'НЕ ДЕЙСТВУЕТ!', disabled: true}),
    }),
    // Все поля с данными внутри поля addresses мы перекинули в getAddressForm
    addresses: new FormArray([getAddressForm()]),
    feature: new FormRecord({}),
  })

  constructor() {
    this.aboutMyselfService.getAddresses()
      .pipe(takeUntilDestroyed())
      .subscribe(addrs => {
        // полностью очищаем и удаляем все пустые адреса, если там ничего нет
        this.form.controls.addresses.clear()

        // прошлись по объекту и каждому адресу пушнули нужную форму из сервиса aboutMyselfService
        for (const addr of addrs) {
          this.form.controls.addresses.push(getAddressForm(addr))
        }

        // Заменяет нужный индекс определенным адресом
        // this.form.controls.addresses.setControl(0,getAddressForm(addrs[2]))
        // Получаем нужный контрол по индексу
        // console.log(this.form.controls.addresses.at(0))
      })

    this.aboutMyselfService.getFeatures()
      .pipe(takeUntilDestroyed())
      .subscribe(features => {
        this.features = features

        for (const feature of features) {
          this.form.controls.feature.addControl(
            feature.code,
            new FormControl(feature.value)
          )
        }
      })

    this.form.controls.personInfo.controls.type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        this.form.controls.personInfo.controls.iin.clearValidators()
        this.form.controls.personInfo.controls.iin.updateValueAndValidity()

        if (value === ReceiverTypePerson.LEGAL) {
          this.form.controls.personInfo.controls.iin.setValidators([
            Validators.required,
            Validators.minLength(12),
            Validators.maxLength(12)
            ]
          )
        }
      })
  }

  onSubmit(event: SubmitEvent) {
    this.form.markAllAsTouched()
    this.form.updateValueAndValidity()
    if (!this.form.valid) return;

    console.log('this.form.value', this.form.value);
    console.log('this.form.getRawValue', this.form.getRawValue())
  }

  addAddress() {
    this.form.controls.addresses.insert(0, getAddressForm());
  }

  removeAddress(index: number) {
    this.form.controls.addresses.removeAt(index, {emitEvent: false});
  }

  sort = () => 0 // функция сортировки для чекбоксов в правильном порядке
}
