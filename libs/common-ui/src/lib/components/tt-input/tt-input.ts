import {
	ChangeDetectorRef,
	Component,
	forwardRef,
	inject,
	input,
	signal,
} from '@angular/core';
import {
	ControlValueAccessor,
	FormsModule, NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';

@Component({
	selector: 'tt-input',
	imports: [FormsModule, ReactiveFormsModule],
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
	cdr = inject(ChangeDetectorRef);

	onChange: any
	onTouched: any

	value: string | null = null;

	writeValue(val: string | null) {
		this.value = val;
		this.cdr.detectChanges()
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
		this.cdr.detectChanges()
	}
}
