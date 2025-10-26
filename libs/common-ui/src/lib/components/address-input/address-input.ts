import { Component, forwardRef, inject, signal } from '@angular/core';
import {
	ControlValueAccessor,
	FormControl,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TtInput } from '../tt-input/tt-input';
import { DadataService } from '../data';
import { debounceTime, switchMap, tap } from 'rxjs';

@Component({
	selector: 'tt-address-input',
	standalone: true,
	imports: [ReactiveFormsModule, TtInput, CommonModule],
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
	_dadataService = inject(DadataService);

	isDropdownOpened = signal<boolean>(true)

	suggestion$ = this.innerSearchControl.valueChanges
		.pipe(
			debounceTime(500),
			switchMap(val => {
				return this._dadataService.getSuggestion(val)
					.pipe(
						tap(res => {
							this.isDropdownOpened.set(!!res.length)
						})
					)
			})
		)

	writeValue(city: string | null): void {
		this.innerSearchControl.patchValue(city, {
			emitEvent: false
		})
	}

	setDisabledState?(isDisabled: boolean): void {
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	onChange(value: any) {
	}

	onTouched() {
	}

	onSuggestPick(city: string) {
		this.isDropdownOpened.set(false)
		this.innerSearchControl.patchValue(city, {
			emitEvent: false
		})
		this.onChange(city)
	}
}
