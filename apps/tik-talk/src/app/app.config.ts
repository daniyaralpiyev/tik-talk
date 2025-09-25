import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authTokenInterceptor} from '@tt/auth';
import {provideState, provideStore} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {PostsEffects, postsFeature} from '../../../../libs/posts/src/lib/data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    // Нужен для получения данных от сервера. Который делает HTTP-запросы
    // (GET/POST/PUT/DELETE). Без него Angular не сможет отправить запросы к API.
    provideHttpClient(withInterceptors([authTokenInterceptor])),
    provideStore(),
    provideEffects(),
    // когда запровайдил две строки, ниже посты заработали
    provideEffects(PostsEffects),
    provideState(postsFeature)
  ]
};
