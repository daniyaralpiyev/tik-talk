import {createSelector} from '@ngrx/store';
import {profileFeature} from './reducer';

// Selectors
// Функции для получения части состояния.
export const selectFilteredProfiles = createSelector(
  profileFeature.selectProfiles,
  (profiles) => profiles
)

export const selectSearchTerm = createSelector(
  profileFeature.selectSearchTerm,
  (searchTerm) => searchTerm
)
