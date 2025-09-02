import { Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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

function getAddressForm() {
  return new FormGroup({
    city: new FormControl<string>(''),
    street: new FormControl<string>(''),
    home: new FormControl<number | null>(null),
    apartment: new FormControl<number | null>(null),
    phone: new FormControl<number | null>(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3)
    ]),
  })
}

@Component({
  selector: 'app-about-myself',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './about-myself.html',
  styleUrl: './about-myself.scss'
})
export class AboutMyself {
  ReceiverTypePhone = ReceiverTypePhone;
  ReceiverTypeOS = ReceiverTypeOS;
  ReceiverTypeWarrantyIos = ReceiverTypeWarrantyIos;
  ReceiverTypePerson = ReceiverTypePerson;

  form = new FormGroup({
    personInfo: new FormGroup({
      name: new FormControl<string>('', Validators.required),
      lastName: new FormControl<string>(''),
      type: new FormControl<ReceiverTypePerson>(ReceiverTypePerson.PERSON),
      iin: new FormControl<string>(''),
    }),
    description: new FormControl<string>(''),
    info: new FormGroup({
      typePhone: new FormControl<ReceiverTypePhone>(ReceiverTypePhone.OPPO),
      typeOS: new FormControl<ReceiverTypeOS>(ReceiverTypeOS.IOS),
      date: new FormControl<string>(''),
      warranty: new FormControl<ReceiverTypeWarrantyIos>(ReceiverTypeWarrantyIos.MONTH1),
      warrantyAndroid: new FormControl<string>({value: 'НЕ ДЕЙСТВУЕТ!', disabled: true}),
    }),
    address: getAddressForm() // остальное передали сюда из формы выше
  })

  constructor() {
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
    console.log('123')
    this.form.markAllAsTouched()
    this.form.updateValueAndValidity()
    if (!this.form.valid) return;

    console.log('this.form.value', this.form.value);
    console.log('this.form.getRawValue', this.form.getRawValue())
  }
}
