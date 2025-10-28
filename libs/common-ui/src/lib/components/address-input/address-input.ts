import {
	ChangeDetectorRef,
	Component,
	forwardRef,
	inject,
	signal,
} from '@angular/core';
import {
	ControlValueAccessor,
	FormControl, FormGroup,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TtInput } from '../tt-input/tt-input';
import { DadataService } from '../data';
import { debounceTime, switchMap, tap } from 'rxjs';
import { DadataSuggestion } from '../data/interfaces/dadata.interface';
import { SvgIcon } from '../svg-icon/svg-icon';

@Component({
	selector: 'tt-address-input',
	standalone: true,
	imports: [ReactiveFormsModule, TtInput, CommonModule, SvgIcon],
	templateUrl: './address-input.html',
	styleUrl: './address-input.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => AddressInput),
		},
	],
})
export class AddressInput implements ControlValueAccessor {
	innerSearchControl = new FormControl();
	_dadataService = inject(DadataService); // Внедряем сервис DadataService через inject() — чтобы получать подсказки адресов.
	isDropdownOpened = signal<boolean>(true); // Создаём реактивный сигнал (Angular Signal), отслеживающий открытие/закрытие дропдауна с подсказками.
	cdr = inject(ChangeDetectorRef); // Внедряем ChangeDetectorRef для ручного обновления представления (CD).

	//Создаём форму с четырьмя контролами: город, улица, дом, квартира.
	addressForm = new FormGroup({
		city: new FormControl(''),
		street: new FormControl(''),
		building: new FormControl(''),
		apartment: new FormControl(''),
	});

	suggestion$ = this.innerSearchControl.valueChanges // Подписка на изменения текста в поле поиска.
		.pipe(
			debounceTime(500),
			switchMap((val) => {
				// Оптимизация запросов пойска
				return this._dadataService.getSuggestion(val).pipe(
					tap((res) => {
						// Преобразуем res в булево значение. Если res.length > 0 (есть подсказки), то true, если нет - false.
						this.isDropdownOpened.set(!!res.length);
					}),
				);
			}),
		);

	// Метод ControlValueAccessor — обновляет значение, когда его задаёт родительская форма.
	writeValue(city: string | null): void {
		// Обновляем поле ввода без вызова valueChanges (чтобы не было лишнего API-вызова).
		this.innerSearchControl.patchValue(city, {
			emitEvent: false,
		});

		// Если пустое значение — очищаем форму и выходим.
		if (!city) {
			this.addressForm.reset();
			this.innerSearchControl.setValue('');
			return;
		}

		const address = city.split(' '); // Разбиваем строку адреса на части (по пробелам).
		this.addressForm.patchValue({
			// Заполняем поля формы соответствующими частями адреса.
			city: address[0] || '',
			street: address[1] || '',
			building: address[2] || '',
			apartment: address[3] || '',
		});
	}

	// Метод интерфейса — управляет доступностью контрола (здесь пустой).
	setDisabledState?(isDisabled: boolean): void {}

	// Регистрирует callback, который Angular вызывает при изменении значения.
	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	// Регистрирует callback, который Angular вызывает при потере фокуса (touched).
	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	// Заглушки для этих методов, чтобы не было ошибок до регистрации.
	onChange(value: any) {}
	onTouched() {}

	onSuggestPick(suggest: DadataSuggestion) {
		// Метод вызывается при выборе подсказки из выпадающего списка.
		this.isDropdownOpened.set(false); // Закрываем дропдаун(выпадающий список) после выбора.
		// this.innerSearchControl.patchValue(city, {
		// 	emitEvent: false
		// })
		// this.onChange(city)

		// Заполняем форму конкретными данными из выбранного адреса.
		this.addressForm.patchValue({
			city: suggest.data.city,
			street: suggest.data.street,
			building: suggest.data.house,
			apartment: suggest.data.flat,
		});

		this.onChange(this.innerSearchControl.value); // Уведомляем Angular-форму о новом значении.
		this.cdr.detectChanges(); // Форсируем обновление UI — чтобы сразу отобразились новые данные.
	}

	cleanInput() {
		const fields = [
			'city',
			'street',
			'building',
			'apartment'
		];
		fields.forEach((field) => this.addressForm.get(field)?.reset());
	}
}
