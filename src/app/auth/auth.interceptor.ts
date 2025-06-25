import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from "@angular/core";
import {Auth} from "./auth";
import {catchError} from "rxjs";
import {throwError} from "rxjs";
import {switchMap} from 'rxjs/operators';

let isRefreshing = false;

// Что делает этот интерсептор:
// перехватывает каждый HTTP-запрос,
// добавляет в него токен авторизации (Bearer token)
// если токен истёк (например, получен 403), автоматически обновляет его и повторяет запрос.
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {

  // req, чтобы перехватить, next, чтобы отпустить
    const auth = inject(Auth); // получаем Auth-сервис
    const token = auth.token; // берём текущий токен

    if (!token) return next(req) // Если токена нет — просто отправляем запрос дальше без изменений.

    if (isRefreshing) { // Если сейчас уже происходит обновление токена, не инициируем его повторно.
        return refreshAndProceed(auth, req, next)
    }

    // Отправляем запрос с токеном.
    // Если получили ошибку 403 (токен истёк), пытаемся обновить токен и повторить запрос.
    return next(addToken(req, token))
        .pipe(
            catchError(err => {

                if (err.status === 403) {
                    return refreshAndProceed(auth, req, next)
                }

                return throwError(() => err);
            })
        )
}

// Что делает:
// Обновляет токен с помощью auth.refreshAuthToken()
// Повторяет оригинальный запрос с новым токеном
const refreshAndProceed = (
    auth: Auth, // присвоили класс Auth
    req: HttpRequest<any>,
    next: HttpHandlerFn) => {

    // Что делает:
    // Обновляет токен с помощью auth.refreshAuthToken()
    // Повторяет оригинальный запрос с новым токеном
    if (!isRefreshing) {
        isRefreshing = true;

        return auth.refreshAuthToken()
            .pipe(
                switchMap(res => {
                    isRefreshing = false;

                    // Если обновление не происходит, запускаем его, сохраняем access_token,
                    // добавляем его в запрос и отправляем заново.
                    return next(addToken(req, res.access_token))
                })
            )
    }
    // Если обновление уже в процессе — ждём окончания и
    // повторно отправляем запрос с текущим токеном.
    return next(addToken(req, auth.token!))
}

// Что делает:
// Клонирует запрос HttpRequest
// Добавляет, в его заголовки поле Authorization: Bearer {токен}
// Возвращает, новый модифицированный запрос (Angular HttpRequest — иммутабельный объект, его нельзя изменить напрямую)
const addToken = (req: HttpRequest<any>, token: string) => {
    return req.clone({
        setHeaders: {
            'Authorization': `Bearer ${token}`
        }
    })
}

// authTokenInterceptor	Основной перехватчик HTTP — добавляет токен и обрабатывает ошибки.
// refreshAndProceed	Обновляет токен, если он истёк, и повторяет запрос.
// addToken	Клонирует, запрос и вставляет в него Authorization заголовок.
