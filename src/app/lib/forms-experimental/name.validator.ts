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
  http = inject(HttpClient); // подключаем HttpClient

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.http
      .get<Profile[]>('https://icherniakov.ru/yt-course/account/test_accounts') // запрос списка пользователей
      .pipe(
        delay(1000), // задержка для примера
        map((users) => {
          // проверяем, есть ли имя в списке
          return users.some((u: Profile) => u.firstName === control.value)
            ? null // если есть → поле валидно
            : { nameValid: { message: `Имя должно быть одним из списка: ${users.map((u) => u.firstName).join(', ')}`}};
        }),
      );
  }
}

