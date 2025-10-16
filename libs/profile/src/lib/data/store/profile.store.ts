/**
 * Пример использования "NgRx Signal Store"
 * (новый, более простой способ управления состоянием без reducer/effects)
 *
 * Перед использованием — нужно импортировать store в routes.ts
 */
import {
	patchState,
	signalStore,
	withComputed,
	withHooks,
	withMethods,
	withState,
} from '@ngrx/signals';
import { Profile, ProfileService } from '@tt/data-access';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

// Тип состояния стора
export interface ProfileStateModel {
	profiles: Profile[];
	profileFilters: Record<string, any>;
}

// Начальное состояние стора
const initialState: ProfileStateModel = {
	profiles: [],
	profileFilters: {},
};

// Создаём сам Signal Store
export const profileStore = signalStore(
	// Состояние
	withState(initialState),

	// Вычисляемые (computed) сигналы
	withComputed(({ profiles }) => {
		return {
			// Создаём дополнительное вычисляемое свойство
			// Пример: добавляем поле `lastName` каждому профилю
			profiles2: computed(() =>
				profiles().map(profile => ({ ...profile, lastName: 'BAL_BLA' }))
			),
		};
	}),

	// Методы стора (аналог эффектов)
	withMethods((state, profileService = inject(ProfileService)) => {
		// Создаём rxMethod — позволяет использовать RxJS внутри Signal Store
		const filterProfiles = rxMethod<Record<string, any>>(
			pipe(
				switchMap(filters =>
					// Запрашиваем данные из API
					profileService.filterProfiles(filters).pipe(
						// После получения — обновляем состояние стора
						tap(res => patchState(state, { profiles: res.items }))
					)
				)
			)
		);

		return {
			filterProfiles, // экспортируем метод
		};
	}),

	// Хуки жизненного цикла
	withHooks({
		// При инициализации стора сразу грузим данные
		onInit(store) {
			store.filterProfiles({});
		},
	})
);
