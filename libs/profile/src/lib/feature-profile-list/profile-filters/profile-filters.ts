import {Component, inject, OnDestroy} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, startWith} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import { profileStore} from '../../data';

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
  store = inject(profileStore);

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
        // this.store.filterProfiles(formValue)
      })
  }

  ngOnDestroy() {
    this.searchFormSub.unsubscribe()
  }
}
