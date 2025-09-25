import {inject, Injectable} from '@angular/core';
import {ProfileService} from '@tt/data-access';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map, switchMap} from 'rxjs';
import {profileActions} from './actions';

// Effects
// Для побочных эффектов: API-запросы, localStorage, навигация.
@Injectable({
  providedIn: 'root'
})
export class ProfileEffects {
  profileService = inject(ProfileService);
  actions$ = inject(Actions)

  filterProfiles = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.filterEvents),
      switchMap(({filters}) => this.profileService.filterProfiles(filters)),
      map(res => profileActions.profilesLoaded({profiles: res.items}))
    )
  })
}
