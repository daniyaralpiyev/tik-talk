import { Profile } from '@tt/data-access';
import { createFeature, createReducer, on } from '@ngrx/store';
import { profileActions } from './actions';

// Reducer
// Функция, которая решает, как меняется состояние после экшена.

// Описываем состояние для feature (раздел стора)
export interface ProfileState {
	profiles: Profile[], // Массив профилей
	profileFilters: Record<string, any>, // Текущие фильтры поиска
	searchTerm: string, // Текст поиска
	page: number, // Текущая страница для пагинации
	size: number // Кол-во элементов на страницу
}

// Начальное состояние (по умолчанию)
export const initialState: ProfileState = {
	profiles: [], // Нет профилей
	profileFilters: {}, // Нет фильтров
	searchTerm: '', // Пустая строка поиска
	page: 1, // Начинаем с 1-й страницы
	size: 10 // По 10 профилей на страницу
}

// Создаём feature-срез состояния через createFeature
export const profileFeature = createFeature({
	name: 'profileFeature', // Имя в сторе
	reducer: createReducer(
		initialState, // Базовое состояние

		// Обработка события profilesLoaded — сохраняем полученные профили
		on(profileActions.profilesLoaded, (state, payload) => {
			return {
				...state,
				// Добавляем новые к уже существующим
				profiles: state.profiles.concat(payload.profiles)
			}
		}),

		// Обработка фильтрации — сбрасываем старые профили и фильтры
		on(profileActions.filterEvents, (state, payload) => {
			return {
				...state,
				profiles: [], // Очищаем список профилей
				profileFilters: payload.filters, // Устанавливаем новые фильтры
				page: 1, // Сбрасываем страницу на 1
			}
		}),

		// 🔵 Обработка смены страницы (для бесконечного скролла)
		on(profileActions.setPage, (state, payload) => {
			let page = payload.page;

			if (!page) page = state.page + 1; // Если не указана — увеличиваем на 1
			return {
				...state,
				page, // Обновляем номер страницы
			};
		}),

		// Обработка изменения поискового запроса
		on(profileActions.setSearchTerm, (state, payload) => {
			return {
				...state,
				searchTerm: payload.term // Сохраняем текст поиска
			}
		})
	)
});
