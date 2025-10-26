import {
	Component,
	forwardRef,
	HostBinding,
	HostListener
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SvgIcon } from '../svg-icon/svg-icon';

@Component({
	selector: 'tt-stack-input',
	standalone: true,
	imports: [SvgIcon, FormsModule, AsyncPipe],
	templateUrl: './tt-stack-input.html',
	styleUrl: './tt-stack-input.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => TtStackInput),
		},
	],
})
export class TtStackInput implements ControlValueAccessor {
	value$ = new BehaviorSubject<string[]>([]);

	_disabled = false

	@HostBinding('class.disabled')
	get disabled(): boolean {
		return this._disabled
	}

	innerInput = '';

	@HostListener('keydown.enter', ['$event'])
	onEnter(event: Event) {
		event.stopPropagation()
		event.preventDefault(); // Предотвращаем стандартное поведение

		if (!this.innerInput.trim()) return; // ✅ Проверяем на пустую строку

		// Добавляем новый тег
		const newValue = [...this.value$.value, this.innerInput.trim()];
		this.value$.next(newValue);
		this.innerInput = '';
		this.onChange(this.value$.value)
	}

	writeValue(stack: string[] | null): void {
		if (!stack) {
			this.value$.next([]);
			return;
		}

		this.value$.next(stack);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this._disabled = isDisabled;
	}

	onChange(value: string[] | null) {}

	onTouched() {}

	onTagDelete(i: number) {
		const tags = this.value$.value;
		tags.splice(i, 1);
		this.value$.next(tags);
		this.onChange(this.value$.value)
	}
}
