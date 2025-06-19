import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Profile} from '../interfaces/profile.interface';

@Injectable({
  providedIn: 'root' // Регистрирует сервис в корневом инжекторе Angular (root), делая его доступным во всем приложении.
})
export class ProfileService {
  http = inject(HttpClient); // Регистрация сервиса. Внедряет Angular-сервис HttpClient для выполнения HTTP-запросов.
  baseApiUrl = 'https://icherniakov.ru/yt-course/'; // Базовый URL API. Централизованное хранение базового URL для всех запросов.

  getTestAccounts() {
    // Метод для запроса данных. Сервис для запросов к API и возвращает Observable<Profile[]>.
    // Дженерик ожидаем массив Profile-ов <Profile[] хранит весь список интерфейса>
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`);
  }

  getMe() {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`);
  }
}
