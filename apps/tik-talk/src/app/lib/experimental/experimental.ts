import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import {NoReactValidator} from '../validator/no-react.validator';

@Component({
	selector: 'app-experimental',
	imports: [JsonPipe, FormsModule, NoReactValidator],
	templateUrl: './experimental.html',
	styleUrl: './experimental.scss',
})
export class Experimental {
	person = {
		name: '',
		lastName: '',
		address: {
			street: '',
			building: 0,
		},
	};

	// Метод вызывается при изменении значения (например, в input)
	onChange(value: string) {
		console.log(value);
		this.person.name = value;
	}

	// Метод вызывается при отправке формы
	onSubmit(form: NgForm) {
		console.log(form);
	}
}
