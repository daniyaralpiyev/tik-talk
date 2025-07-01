import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Profile} from '../interfaces/profile.interface';
import {Pageble} from '../interfaces/pageble.interface';
import {map, tap} from 'rxjs';

@Injectable({
  providedIn: 'root' // Регистрирует сервис в корневом инжекторе Angular (root), делая его доступным во всем приложении.
})
export class ProfileService {
  http = inject(HttpClient); // Регистрация сервиса. Внедряет Angular-сервис HttpClient для выполнения HTTP-запросов.
  baseApiUrl = 'https://icherniakov.ru/yt-course/'; // Базовый URL API. Централизованное хранение базового URL для всех запросов.

  me = signal<Profile | null>(null);

  getTestAccounts() {
    // Метод для запроса данных. Сервис для запросов к API и возвращает Observable<Profile[]>.
    // Дженерик ожидаем массив Profile-ов <Profile[] хранит весь список интерфейса>
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`);
  }

  getMe() {
    // Проверь Profile передается Profile[] или Profile?
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`)
      .pipe(
        tap(res => this.me.set(res))
      )
  }

  getSubscribersShortList() {
    return this.http.get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`)
      .pipe(
        map(res => res.items.slice(0,3))
      )
  }
}
