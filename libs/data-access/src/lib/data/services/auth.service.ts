import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, tap, throwError} from 'rxjs';
import {TokenResponse} from '../interfaces/auth.interface';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient); // Инъекция HttpClient для выполнения HTTP-запросов
  router = inject(Router); // Инъекция Angular Router для перенаправления пользователя (navigate())
  cookieService = inject(CookieService); // Инъекция сервиса для чтения/записи токенов в cookie
  baseApiUrl = 'https://icherniakov.ru/yt-course/auth/'; // Базовый адрес для API авторизации

  token: string | null = null; // token изначально = null
  refreshToken: string | null = null; // refreshToken изначально = null

  // Проверяет, есть ли токен в памяти (this.token)
  // Если нет — пытается достать токены из cookies
  // Возвращает, true, если токен есть, иначе false
  // ✅ Используется, чтобы узнать: пользователь авторизован или нет
  get isAuth() {
    if (!this.token) {
      this.token = this.cookieService.get('token'); // если токена пробуем взять из cookieService
      this.refreshToken = this.cookieService.get('refreshToken');
    }

    return !!this.token; // проверка авторизован юзер или нет
  }

  // Создаёт FormData с логином и паролем
  // Отправляет POST-запрос на /token (авторизация)
  // Получает access_token и refresh_token
  // Сохраняет их в cookie и в память (this.token) через savesTokens()
  login(payload: { username: string, password: string }) {
    const fd = new FormData();

    fd.append('username', payload.username);
    fd.append('password', payload.password);

    return this.http.post<TokenResponse>(
      `${this.baseApiUrl}token`,
      fd,
    ).pipe(
      tap(value => this.savesTokens(value))
    )
  }

  // Отправляет refresh-токен на сервер (/refresh)
  // Получает новые токены (access_token, refresh_token)
  // Сохраняет их через savesTokens()
  // Если ошибка — вызывает logout() и завершает Observable с ошибкой
  refreshAuthToken() {
    return this.http.post<TokenResponse>(
      `${this.baseApiUrl}refresh`,
      {
        refresh_token: this.refreshToken,
      }
    ).pipe(
      tap(value => this.savesTokens(value)),
      catchError(err => {
        this.logout()
        return throwError(err)
      })
    )
  }

  // Очищает все куки
  // Сбрасывает токены из памяти
  // Перенаправляет пользователя на страницу логина
  logout() {
    this.cookieService.deleteAll() // удаляет куки
    this.token = null; // сбрасывает
    this.refreshToken = null; // сбрасывает
    this.router.navigate(['/login']); // перебрасывает
  }

  // Сохраняет access_token и refresh_token в:
  // Память (this.token)
  // Cookie (через cookieService)
  // ✅ Вызывается после успешного логина или обновления токена
  savesTokens(res: TokenResponse) {
    this.token = res.access_token;
    this.refreshToken = res.refresh_token;

    this.cookieService.set('token', this.token);
    this.cookieService.set('refreshToken', this.refreshToken);
  }
}

// isAuth	Проверяет наличие токена (авторизован ли пользователь).
// login	Выполняет логин, получает и сохраняет токены.
// refreshAuthToken	Обновляет токен по refresh_token, если access истёк.
// logout	Полностью разрознивает пользователя.
// savesTokens	Централизованно сохраняет токены в память и куки.
