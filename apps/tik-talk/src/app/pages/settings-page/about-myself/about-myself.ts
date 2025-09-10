import {AfterViewInit, Component, ElementRef, HostListener, inject, Renderer2} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, FormRecord, FormsModule, ReactiveFormsModule,
  ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AboutMyselfService} from '../../../data/services/about-myself.service';
import {KeyValuePipe} from '@angular/common';
import {Subject} from 'rxjs';
import { MaskitoDirective } from '@maskito/angular';
import maskPhone from './maskito-phone'; // твой mask.ts
import maskData from './maskito-date'; // твой mask.ts

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
  TYPE = 'ВЫБЕРИТЕ ГАРАНТИЮ',
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
  phone?: string
}

interface Feature {
  code: string;    // Уникальный код фичи, напр. 'lift'
  label: string;   // человеко читаемое название
  value: boolean;  // включена/выключена
}

function getAddressForm(initialValue: Address = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValue.city ?? ''),
    street: new FormControl<string>(initialValue.street ?? ''),
    home: new FormControl<number | null>(initialValue.home ?? null),
    apartment: new FormControl<number | null>(initialValue.apartment ?? null),
    phone: new FormControl<string>(initialValue.phone ?? '', [
      Validators.required
      ])
    })
}

function validateStartWith(forbiddenLetter: string): ValidatorFn {
  return (control: AbstractControl) => {
    const value: string = control.value ?? '';

    // сравниваем оба в нижнем регистре
    if (value.toLowerCase().startsWith(forbiddenLetter.toLowerCase())) {
      return {
        startsWith: {
          message: `${forbiddenLetter} это имя CEO!`
        }
      };
    }

    return null;
  };
}

function validateDateRange({fromControlName, toControlName}: {fromControlName: string, toControlName: string}) {
  return ( control: AbstractControl ) => {
    const fromControl = control.get(fromControlName)
    const toControl = control.get(toControlName)

    if (!fromControl || !toControl) return null

    const fromDate = new Date(fromControl.value)
    const toDate = new Date(toControl.value)

    if (fromDate && toDate && fromDate > toDate) {
      toControl.setErrors({dateRange: {message: 'Дата не может быть с конца!'}})
      return {dateRange: {message: 'Дата не может быть с конца!'}}
    }

    return null
  }
}


@Component({
  selector: 'app-about-myself',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    KeyValuePipe,
    MaskitoDirective
  ],
  templateUrl: './about-myself.html',
  styleUrl: './about-myself.scss'
})
export class AboutMyself implements AfterViewInit {
  ReceiverTypePhone = ReceiverTypePhone;
  ReceiverTypeOS = ReceiverTypeOS;
  ReceiverTypeWarrantyIos = ReceiverTypeWarrantyIos;
  ReceiverTypePerson = ReceiverTypePerson;

  readonly phoneMask = maskPhone; // доступ к маске для инпута
  readonly maskData = maskData; // доступ к маске для инпута

  r2 = inject(Renderer2)
  hostElement = inject(ElementRef)
  private destroy$ = new Subject<void>()

  aboutMyselfService = inject(AboutMyselfService)
  features: Feature[] = []

  form = new FormGroup({
    personInfo: new FormGroup({
      name: new FormControl<string>(
        '',
        [Validators.required, validateStartWith('Vax')]
      ),
      lastName: new FormControl<string>(''),
      type: new FormControl<ReceiverTypePerson>(ReceiverTypePerson.PERSON),
      iin: new FormControl<string>(''),
      iinDisable: new FormControl<string>({value: 'ТОЛЬКО ЮР. ЛИЦАМ!', disabled: true}),
    }),
    description: new FormControl<string>(''),
    info: new FormGroup({
      typePhone: new FormControl<ReceiverTypePhone>(ReceiverTypePhone.OPPO),
      typeOS: new FormControl<ReceiverTypeOS>(ReceiverTypeOS.IOS),
      date: new FormControl<string>(''),
      warranty: new FormControl<ReceiverTypeWarrantyIos>(ReceiverTypeWarrantyIos.TYPE),
      warrantyAndroid: new FormControl<string>({value: 'НЕ ДЕЙСТВУЕТ!', disabled: true}),
    }),
    // Все поля с данными внутри поля addresses мы перекинули в getAddressForm
    addresses: new FormArray([getAddressForm()]),
    feature: new FormRecord({}),
    dateRange: new FormGroup({
      from: new FormControl<string>(''),
      to: new FormControl<string>(''),
    }, validateDateRange({fromControlName: 'from', toControlName: 'to'}))
  })

  constructor() {
    this.aboutMyselfService
      .getAddresses()
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

  addAddress() {
    this.form.controls.addresses
      // Вставляем новую форму адреса в начало массива адресов
      .insert(0, getAddressForm());
  }

  removeAddress(index: number) {
    this.form.controls.addresses
      .removeAt(index, {emitEvent: false});
  }

  sort = () => 0 // функция сортировки для чекбоксов в правильном порядке

  onSubmit(event: SubmitEvent) {
    this.form.markAllAsTouched() // пометить все контролы как тронутые
    this.form.updateValueAndValidity() // пересчитать валидность формы на соответствие
    if (!this.form.valid) return; // если форма невалидна — прерываем

    console.log('this.form.value', this.form.value);
    console.log('this.form.getRawValue', this.form.getRawValue())
  }

  ngAfterViewInit() {
    this.resizeFeed()
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.resizeFeed()
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  resizeFeed() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect()
    const height = window.innerHeight - top - 24 - 24
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
