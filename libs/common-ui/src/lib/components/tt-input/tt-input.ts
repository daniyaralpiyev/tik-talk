import { Component, forwardRef, input, signal } from '@angular/core';
import {
	ControlValueAccessor,
	FormsModule, NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { SvgIcon } from '../index';

@Component({
	selector: 'tt-input',
	imports: [FormsModule, ReactiveFormsModule, SvgIcon],
	templateUrl: './tt-input.html',
	styleUrl: './tt-input.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			// forwardRef ссылается к компоненту TtInput до того как появился компонент TtInput
			useExisting: forwardRef(() => TtInput),
		},
	],
})
export class TtInput implements ControlValueAccessor {
	type = input<'text' | 'password'>('text');
	placeholder = input<string>();

	disabled = signal<boolean>(false)

	onChange: any
	onTouched: any

	value: string | null = null;

	writeValue(val: string | null) {
		this.value = val;
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled.set(isDisabled);
	}

	onModelChange(val: string | null): void {
		this.onChange(val);
	}
}
