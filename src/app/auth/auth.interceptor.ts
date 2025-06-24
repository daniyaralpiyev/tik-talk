import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from "@angular/core";
import {Auth} from "./auth";
import {catchError} from "rxjs";
import {throwError} from "rxjs";
import {switchMap} from 'rxjs/operators';

let isRefreshing = false;

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    // req, чтобы перехватить, next, чтобы отпустить
    const auth = inject(Auth);
    const token = auth.token;

    if (!token) return next(req)

    if (isRefreshing) {
        return refreshAndProceed(auth, req, next)
    }

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

const refreshAndProceed = (
    auth: Auth,
    req: HttpRequest<any>,
    next: HttpHandlerFn) => {
    if (!isRefreshing) {
        isRefreshing = true;
        return auth.refreshAuthToken()
            .pipe(
                switchMap(res => {
                    isRefreshing = false;
                    return next(addToken(req, res.access_token))
                })
            )
    }

    return next(addToken(req, auth.token!))
}

const addToken = (req: HttpRequest<any>, token: string) => {
    return req.clone({
        setHeaders: {
            'Authorization': `Bearer ${token}`
        }
    })
}

// Базовое объяснение работы с токенам:
// 1)Отправлю бэку логин пароль
// 2)Он сделает зашифрованную строчку длинную в которой зашифрованная уникальная информация для этого пользователя
// 3)Он нам его прицепил после
// 4)Он сохранил в куки
// 5)Куки постоянно летает межу бэком и фронтом
// 6)Бэк на каждом запросе смотрит в куки, что там смотрит эту строчку он знает как его расшифровать
// 7)Он его расшифровывает
// 8)После понимает так это же это тот юзер обращается все в порядке
// 9)И отдает данные спокойно
