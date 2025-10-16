import {createActionGroup, props} from '@ngrx/store';
import {Profile} from '@tt/data-access';

// Actions
// Это события, описывающие, что произошло в приложении.
export const profileActions = createActionGroup({
  source: 'profile',
  events: {
    'filter events': props<{filters: Record<string, any>}>(),
		'set page': props<{page?: number}>(),
    'profiles loaded': props<{profiles: Profile[]}>(),
    'set search term': props<{term: string}>(),
  }
})
