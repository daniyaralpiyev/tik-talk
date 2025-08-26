import {
	AbstractControl,
	AsyncValidator,
	ValidationErrors,
} from '@angular/forms';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable } from 'rxjs';
import { Profile } from '../../data/interfaces/profile.interface';

@Injectable({
	providedIn: 'root',
})
export class NameValidator implements AsyncValidator {
	http = inject(HttpClient);

	validate(control: AbstractControl): Observable<ValidationErrors | null> {
		return this.http
			.get<Profile[]>('https://icherniakov.ru/yt-course/account/test_accounts')
			.pipe(
				delay(1000),
				map((users) => {
					return users.filter((u: Profile) => u.firstName === control.value)
						.length > 0
						? {
								nameValid: {
									message: `Имя должно быть одним из списка: ${users.map((u: Profile) => u.firstName).join(', ')}`,
								},
							}
						: null;
				}),
			);
	}
}
