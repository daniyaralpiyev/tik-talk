import {Profile} from '@tt/data-access';
import {createFeature, createReducer, on} from '@ngrx/store';
import {profileActions} from './actions';

// Reducer
// Функция, которая решает, как меняется состояние после экшена.
export interface ProfileState {
  profiles: Profile[],
  profileFilters: Record<string, any>,
  searchTerm: string
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {},
  searchTerm: ''
}

export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,
    // кладёт массив профилей в стор.
    on(profileActions.profilesLoaded, (state, payload) => ({
        ...state,
        profiles: payload.profiles
    })),
    // сохраняет введённый текст поиска.
    on(profileActions.setSearchTerm, (state, payload) => ({
        ...state,
        searchTerm: payload.term
    }))
  )
})
