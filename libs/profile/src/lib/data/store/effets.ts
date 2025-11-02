import { inject, Injectable } from '@angular/core';
import { ProfileService } from '@tt/data-access';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { profileActions } from './actions';
import { Store } from '@ngrx/store';
import {
	selectProfileFilters,
	selectProfilePageable,
} from './selectors';

// Effects — слушает экшены и запускает асинхронные действия
// Используются для побочных эффектов: API-запросы, навигация, localStorage и т.д.
@Injectable({
	providedIn: 'root'
})
export class ProfileEffects {
	// Подключаем зависимости
	profileService = inject(ProfileService); // сервис для запросов к API
	actions$ = inject(Actions); // поток всех действий (actions)
	store = inject(Store); // доступ к состоянию NgRx Store

	filterProfiles = createEffect(() => {
		return this.actions$.pipe(
			ofType( // Реагируем на экшены filterEvents и setPage
				profileActions.filterEvents,
				profileActions.setPage
			),

			withLatestFrom( // Получаем текущие фильтры и параметры страницы из стора
				this.store.select(selectProfileFilters),
				this.store.select(selectProfilePageable)
			),

			switchMap(([_, filters, pageable]) => { // Делаем API-запрос через ProfileService
				return this.profileService.filterProfiles({ // Объединяем фильтры и пагинацию → передаём в запрос
					...pageable,
					...filters
				});
			}),

			// Когда данные пришли — отправляем новый экшен profilesLoaded
			map(res => profileActions.profilesLoaded({ profiles: res.items }))
		);
	});
}
