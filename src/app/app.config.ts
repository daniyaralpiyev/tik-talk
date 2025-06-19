import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authTokenInterceptor} from './auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    // Нужен для получения данных от сервера. Который делает HTTP-запросы
    // (GET/POST/PUT/DELETE). Без него Angular не сможет отправить запросы к API.
    provideHttpClient(withInterceptors([authTokenInterceptor]))
  ]
};
