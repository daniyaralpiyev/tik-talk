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
import { MockService } from '../../../../../../libs/data-access/src/lib/data/services/mock.service';
import { NameValidator } from './name.validator';
import { KeyValuePipe } from '@angular/common';

// Перечисление: тип получателя — физ./юр. лицо
enum ReceiverType {
	PERSON = 'PERSON',
	LEGAL = 'LEGAL',
}

// Интерфейс адреса — описывает структуру одного адреса
interface Address {
	city?: string;
	street?: string;
	building?: number;
	apartment?: number;
}

// Интерфейс "фичи" (например, опции доставки)
interface Feature {
  code: string;    // Уникальный код фичи, напр. 'lift'
  label: string;   // человеко читаемое название
  value: boolean;  // включена/выключена
}

// Функция: создаёт FormGroup для одного адреса, с начальными значениями
// Тип Address — это объект с полями (например, city, street, building, apartment).
// По умолчанию (= {}) передаётся пустой объект, если ничего не передали.
function getAddressForm(initialValue: Address = {}) {
  return new FormGroup({
    // по умолчанию initialValue.city или пустая строка
    city: new FormControl<string>(initialValue.city ?? ''),
    street: new FormControl<string>(initialValue.street ?? ''),
    // либо число, либо null (если не задан)
    building: new FormControl<number | null>(initialValue.building ?? null),
    apartment: new FormControl<number | null>(initialValue.apartment ?? null),
  });
}

// Замыкание-валидатор: создаёт валидатор, который проверяет,
// начинается ли значение с запрещённой буквы
function validateStartWith(forbiddenLetter: string): ValidatorFn {
  return (control: AbstractControl) => {
    // Получаем текущее значение контрола
    const value = control.value;
    // Если значения нет или это не строка — валидатор не выдаёт ошибку
    if (!value || typeof value !== 'string') return null;

    // Если значение начинается с forbiddenLetter — возвращаем объект ошибки,
    // иначе возвращаем null (ошибок нет)
    return value.startsWith(forbiddenLetter)
      ? {startsWith: {message: `${forbiddenLetter} - последняя буква алфавита`}}
      : null;
  };
}

// Эта функция — кастомный валидатор для FormGroup, который проверяет,
// что поле "Дата начала" (from) не позже, чем "Дата окончания" (to).
function validateDateRange({fromControlName, toControlName,}:
                           { fromControlName: string; toControlName: string; }) {
	return (control: AbstractControl) => {
    // Получаем вложенные контролы по их именам
		const fromControl = control.get(fromControlName);
		const toControl = control.get(toControlName);

    // Если любой из контролов отсутствует — валидатор ничего не делает
		if (!fromControl || !toControl) return null;

    // Преобразуем их значения в объекты Date
		const fromDate = new Date(fromControl.value);
		const toDate = new Date(toControl.value);

    // Если обе даты валидны и fromDate > toDate — ставим ошибку на toControl
		if (fromDate && toDate && fromDate > toDate) {
      // Здесь их два валидатора — это два разных уровня валидации: поле и группа.
			toControl.setErrors({
        // (setErrors) → ошибка на поле (toDate), то есть пользователь указал диапазон "задом наперёд"
				dateRange: { message: 'Дата начала не может быть с конца' },
			});
      // (return ...) → ошибка на всю группу.
			return { dateRange: { message: 'Дата начала не может быть с конца' } };
		}

    // Если проверка прошла — возвращаем null (группа валидна)
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
	ReceiverType = ReceiverType; // Делаем доступным enum в шаблоне/классе

	mockService = inject(MockService);
	nameValidator = inject(NameValidator); // Инжектим асинхронный валидатор NameValidator

	features: Feature[] = []; // Массив доступных фич (будет заполняться из сервиса)

  // Создаём реактивную форму (FormGroup)
	form = new FormGroup({
    // Контрол для типа получателя, по умолчанию - PERSON
		type: new FormControl<ReceiverType>(ReceiverType.PERSON),

    // Контрол для имени с синхронными и асинхронными валидаторами
		name: new FormControl<string>('', {
      validators: [Validators.required],
      asyncValidators: [this.nameValidator.validate.bind(this.nameValidator)],
      updateOn: 'blur'
      }
		),
		inn: new FormControl<string>(''),
    // Контрол с дефолтным значением 'angular2025'
		lastName: new FormControl<string>('angular2025'),
    // FormArray для адресов, инициализируем с одним адресом через фабрику getAddressForm()
    addresses: new FormArray([getAddressForm()]),
    // FormRecord (словарь) для feature: ключ — code фичи, значение — FormControl
		feature: new FormRecord({}),
    // Вложенная группа для диапазона дат с кросс-полем валидатором validateDateRange
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
    this.mockService // Подписываемся на получение адресов из сервиса
      .getAddresses()
      .pipe(takeUntilDestroyed()) // автоматическая отписка при уничтожении компонента
			.subscribe((addrs) => {
				this.form.controls.addresses.clear(); // Очищаем существующие контролы адресов

        // Для каждого адреса из сервиса создаём FormGroup и пушим в FormArray
				for (const addr of addrs) {
					this.form.controls.addresses.push(getAddressForm(addr));
				}



				// this.form.controls.addresses.setControl(1, getAddressForm(addrs[0])) // Заменяет все пустые поля инпут 1-ми значениями
				// console.log(this.form.controls.addresses.at(0)) // Получаем в консоли первое значение
				// this.form.controls.addresses.disable() // блокирует все поля
			});

		this.mockService // Подписываемся на получение списка фич из сервиса
			.getFeatures()
			.pipe(takeUntilDestroyed())
			.subscribe((features) => {
				this.features = features; // Сохраняем массив фич в свойство для отображения в шаблоне

        // Для каждой фичи добавляем контрол в FormRecord: ключ = feature.code, контрол хранит feature.value
				for (const feature of features) {
					this.form.controls.feature.addControl(
						feature.code, // имя/ключ контрола в FormRecord
						new FormControl(feature.value), // начальное булево значение
					);
				}
			});

    // Подписываемся на изменения поля type (PERSON / LEGAL)
    this.form.controls.type.valueChanges // valueChanges — Observable
			.pipe(takeUntilDestroyed())
			.subscribe((val) => {
				this.form.controls.inn.clearValidators(); // Сначала убираем все валидаторы у поля inn

				if (val === ReceiverType.LEGAL) { // Если выбран тип LEGAL — добавляем валидаторы для ИНН
					this.form.controls.inn.setValidators([
						Validators.required,
						Validators.minLength(10),
						Validators.maxLength(10),
					]);
				}
			});
	}

  // Обработчик сабмита формы
  onSubmit(event: SubmitEvent) {
    this.form.markAsTouched(); // пометить все контролы как тронутые
    this.form.updateValueAndValidity(); // пересчитать валидность формы на соответствие
    if (this.form.invalid) return; // если форма невалидна — прерываем

    // Выводим текущее value и "сырые" значения (getRawValue)
		console.log('this.form.value', this.form.value);
		console.log('this.form.getRawValue', this.form.getRawValue());
	}

  // Вставить новую форму адреса в начало FormArray
	addAddress() {
		this.form.controls.addresses.insert(0, getAddressForm());
	}

  // Удалить адрес по индексу, не эмитируя событие удаления (emitEvent: false)
	deleteAddress(index: number) {
		this.form.controls.addresses.removeAt(index, { emitEvent: false });
	}

  // Сортировочная функция-заглушка (используется в шаблоне для чекбоксов/trackBy и т.п.)
  sort = () => 0; // для чекбоксов, чтобы работали с правильной логикой
}
