import {Component, inject, OnDestroy} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, startWith, switchMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {ProfileService} from '@tt/data-access';
import {Store} from '@ngrx/store';
import {profileActions} from '../../data';

@Component({
  selector: 'app-profile-filters',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './profile-filters.html',
  styleUrl: './profile-filters.scss'
})
export class ProfileFilters implements OnDestroy {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);
  store = inject(Store);

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  })

  searchFormSub!: Subscription

  constructor() {
    this.searchFormSub = this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(500), // ждем 0,5 секунду после выводим значение
        // Очищаем за собой работает типа отписки. Этот подход отписки появился в ангуляре с 17 версии
        // takeUntilDestroyed()
      )
      .subscribe( formValue => { // оставили subscribe чтобы просто сама подписка была
        this.store.dispatch(profileActions.filterEvents({filters: formValue}))
      })
  }

  ngOnDestroy() {
    this.searchFormSub.unsubscribe()
  }
}
