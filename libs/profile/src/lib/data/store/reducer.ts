import {Profile} from '@tt/data-access';
import {createFeature, createReducer, on} from '@ngrx/store';
import {profileActions} from './actions';

// Reducer
// Функция, которая решает, как меняется состояние после экшена.
export interface ProfileState {
  profiles: Profile[],
  profileFilters: Record<string, any>,
  searchTerm: string,
	page: number,
	size: number
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {},
  searchTerm: '',
	page: 1,
	size: 10
}

export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,
    // кладёт массив профилей в стор.
    on(profileActions.profilesLoaded, (state, payload) => {
        return {
					...state,
					profiles: state.profiles.concat(payload.profiles)
				}
    }),
		on(profileActions.filterEvents, (state, payload) => {
			return {
				...state,
				profiles: [],
				profileFilters: payload.filters,
				page: 1,
			}
		}),
		on(profileActions.setPage, (state, payload) => {
			let page = payload.page;

			if (!page) page = state.page + 1;

			return {
				...state,
				page,
			};
		}),
    // сохраняет введённый текст поиска.
    on(profileActions.setSearchTerm, (state, payload) => {
        return {
					...state,
					searchTerm: payload.term
				}
    })
  )
})
