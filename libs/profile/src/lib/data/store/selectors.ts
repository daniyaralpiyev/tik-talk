import { createSelector } from '@ngrx/store';
import { profileFeature } from './reducer';

// Selector — это функции, которые "доста́ют" нужные данные из стора.
// Они не изменяют состояние, а только выбирают нужные куски данных.

// Получаем все загруженные профили
export const selectFilteredProfiles = createSelector(
	profileFeature.selectProfiles, // Берём поле profiles из стора
	(profiles) => profiles // Возвращаем как есть
)

// Получаем объект пагинации (текущая страница и размер страницы)
export const selectProfilePageable = createSelector(
	profileFeature.selectProfileFeatureState, // Достаём всё состояние profileFeature
	(state) => {
		return {
			page: state.page, // Номер страницы
			size: state.size, // Размер страницы
		}
	}
)

// Получаем фильтры профилей
export const selectProfileFilters = createSelector(
	profileFeature.selectProfileFilters, // Берём поле profileFilters
	(filters) => filters // Возвращаем как есть
)

// Получаем текущий поисковый запрос (searchTerm)
export const selectSearchTerm = createSelector(
	profileFeature.selectSearchTerm, // Берём поле searchTerm
	(searchTerm) => searchTerm // Возвращаем как есть
)
