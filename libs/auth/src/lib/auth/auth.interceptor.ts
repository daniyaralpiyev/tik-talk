import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from "@angular/core";
import {BehaviorSubject, catchError, filter, finalize} from "rxjs";
import {throwError} from "rxjs";
import {switchMap} from 'rxjs/operators';
import {AuthService} from '@tt/data-access';

const isRefreshing$ = new  BehaviorSubject<boolean>(false);

// Что делает этот интерсептор:
// перехватывает каждый HTTP-запрос,
// добавляет в него токен авторизации (Bearer token)
// если токен истёк (например, получен 403), автоматически обновляет его и повторяет запрос.
// req, чтобы перехватить, next, чтобы отпустить
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
	if (req.url.includes('dadata.ru')) return next(req)

	const authService = inject(AuthService);
	const token = authService.token;

	if (!token) return next(req) // Если токена нет — просто отправляем запрос дальше без изменений.

	if (isRefreshing$.value) { // Если сейчас уже происходит обновление токена, не инициируем его повторно.
		return refreshAndProceed(authService, req, next)
	}

	// Отправляем запрос с токеном.
	// Если получили ошибку 403 (токен истёк), пытаемся обновить токен и повторить запрос.
	return next(addToken(req, token))
		.pipe(
			catchError(err => {

				if (err.status === 403) {
					return refreshAndProceed(authService, req, next)
				}

				return throwError(() => err);
			})
		)
}

// Что делает:
// Обновляет токен с помощью auth.refreshAuthToken()
// Повторяет оригинальный запрос с новым токеном
const refreshAndProceed = (
    authService: AuthService, // присвоили класс Auth
    req: HttpRequest<any>,
    next: HttpHandlerFn) => {

    // Что делает:
    // Обновляет токен с помощью auth.refreshAuthToken()
    // Повторяет оригинальный запрос с новым токеном
    if (!isRefreshing$.value) {
        isRefreshing$.next(true);

        return authService.refreshAuthToken()
            .pipe(
                switchMap(res => {

                    // Если обновление не происходит, запускаем его, сохраняем access_token,
                    // добавляем его в запрос и отправляем заново.
                    // return next(addToken(req, res.access_token))
                    //   .pipe(
                    //     tap(()=> isRefreshing$.next(false))
                    //   )

                    // этот код я взял с chatgpt
                    return next(addToken(req, res.access_token)).pipe(
                        finalize(() => isRefreshing$.next(false))
                      );
                })
            )
    }

    if (req.url.includes('refresh')) return next(addToken(req, authService.token!))

    // Если обновление токена уже идёт, то:
    // ждём его завершения (isRefreshing$ станет false)
    // затем повторяем оригинальный запрос, добавив актуальный токен.
    return isRefreshing$.pipe(
      filter(isRefreshing => !isRefreshing),
      switchMap(res => {
        return next(addToken(req, authService.token!))
      })
    );
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
