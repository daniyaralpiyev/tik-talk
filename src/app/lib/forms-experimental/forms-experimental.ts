import { Component, inject } from '@angular/core';
import {
	AbstractControl,
	FormArray,
	FormControl,
	FormGroup,
	FormRecord,
	ReactiveFormsModule,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MockService } from '../../data/services/mock.service';
import { NameValidator } from './name.validator';
import { KeyValuePipe } from '@angular/common';

enum ReceiverType {
	PERSON = 'PERSON',
	LEGAL = 'LEGAL',
}

interface Address {
	city?: string;
	street?: string;
	building?: number;
	apartment?: number;
}

interface Feature {
	code: string;
	label: string;
	value: boolean;
}

function getAddressForm(initialValue: Address = {}) {
	return new FormGroup({
		city: new FormControl<string>(initialValue.city ?? ''),
		street: new FormControl<string>(initialValue.street ?? ''),
		building: new FormControl<number | null>(initialValue.building ?? null),
		apartment: new FormControl<number | null>(initialValue.apartment ?? null),
	});
}

// Функция валидатор(замыкание)
function validateStartWith(forbiddenLetter: string): ValidatorFn {
	return (control: AbstractControl) => {
		return control.value.startsWith(forbiddenLetter)
			? {
					startsWith: {
						message: `${forbiddenLetter} - последняя буква алфавита`,
					},
				}
			: null;
	};
}

function validateDateRange({
	fromControlName,
	toControlName,
}: {
	fromControlName: string;
	toControlName: string;
}) {
	return (control: AbstractControl) => {
		const fromControl = control.get(fromControlName);
		const toControl = control.get(toControlName);

		if (!fromControl || !toControl) return null;

		const fromDate = new Date(fromControl.value);
		const toDate = new Date(toControl.value);

		if (fromDate && toDate && fromDate > toDate) {
			toControl.setErrors({
				dateRange: { message: 'Дата начала не может быть с конца' },
			});
			return { dateRange: { message: 'Дата начала не может быть с конца' } };
		}

		return null;
	};
}

@Component({
	selector: 'app-forms-experimental',
	imports: [ReactiveFormsModule, KeyValuePipe],
	templateUrl: './forms-experimental.html',
	styleUrl: './forms-experimental.scss',
})
export class FormsExperimental {
	ReceiverType = ReceiverType;

	mockService = inject(MockService);
	nameValidator = inject(NameValidator);

	features: Feature[] = [];

	form = new FormGroup({
		type: new FormControl<ReceiverType>(ReceiverType.PERSON),
		name: new FormControl<string>('', {
			validators: [Validators.required],
			asyncValidators: [this.nameValidator.validate.bind(this.nameValidator)],
			updateOn: 'blur',
		}),
		inn: new FormControl<string>(''),
		lastName: new FormControl<string>('angular2025'),
		addresses: new FormArray([getAddressForm()]),
		feature: new FormRecord({}),
		dateRange: new FormGroup(
			{
				from: new FormControl<string>(''),
				to: new FormControl<string>(''),
			},
			validateDateRange({ fromControlName: 'from', toControlName: 'to' }),
		),
	});

	// Конструктор теперь знает благодаря valueChanges
	// при заполнении формы от физ лица и юр лица
	constructor() {
		this.mockService
			.getAddresses()
			.pipe(takeUntilDestroyed())
			.subscribe((addrs) => {
				// while (this.form.controls.addresses.controls.length > 0) {
				//   this.form.controls.addresses.removeAt(0)
				// }
				this.form.controls.addresses.clear();

				for (const addr of addrs) {
					this.form.controls.addresses.push(getAddressForm(addr));
				}

				// this.form.controls.addresses.setControl(1, getAddressForm(addrs[0])) // Заменяет все пустые поля инпут первыми значениями
				// console.log(this.form.controls.addresses.at(0)) // Получаем в консоли первое значение
				// this.form.controls.addresses.disable() // блокирует все поля
			});

		this.mockService
			.getFeatures()
			.pipe(takeUntilDestroyed())
			.subscribe((features) => {
				this.features = features;

				for (const feature of features) {
					this.form.controls.feature.addControl(
						feature.code, // имя или ключ для конрола
						new FormControl(feature.value), // значение контрола
					);
				}
			});

		this.form.controls.type.valueChanges // valueChanges это observable
			.pipe(takeUntilDestroyed())
			.subscribe((val) => {
				// убирает все валидаторы inn через clearValidators при выборе физ лицо
				this.form.controls.inn.clearValidators();

				// Добавление валидатора для поля ИНН при выборе, юр лица
				if (val === ReceiverType.LEGAL) {
					this.form.controls.inn.setValidators([
						Validators.required,
						Validators.minLength(10),
						Validators.maxLength(10),
					]);
				}
			});
	}

	onSubmit(event: SubmitEvent) {
		this.form.markAsTouched(); // помечает все поля, как трогали
		this.form.updateValueAndValidity(); // метод проверяет все поля на соответствие с правилами валидации
		if (this.form.invalid) return;

		console.log('this.form.value', this.form.value);
		console.log('this.form.getRawValue', this.form.getRawValue()); // выводим поля формы
	}

	// вставляем новую форму адреса в начало массива адресов
	addAddress() {
		this.form.controls.addresses.insert(0, getAddressForm());
	}

	deleteAddress(index: number) {
		this.form.controls.addresses.removeAt(index, { emitEvent: false });
	}

	sort = () => 0; // для чекбоксов чтобы работали с правильной логикой
}
