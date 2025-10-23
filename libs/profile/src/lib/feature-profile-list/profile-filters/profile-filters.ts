import {ChangeDetectionStrategy, Component, inject, OnDestroy} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, startWith} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {profileActions, selectSearchTerm} from '../../data';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { SvgIcon, TtStackInput } from '@tt/common-ui';

@Component({
	selector: 'app-profile-filters',
	imports: [ReactiveFormsModule, SvgIcon, TtStackInput],
	templateUrl: './profile-filters.html',
	styleUrl: './profile-filters.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFilters implements OnDestroy {
	fb = inject(FormBuilder);
	store = inject(Store);

	searchForm = this.fb.group({
		firstName: [''],
		lastName: [''],
		city: [''],
		stack: [''],
	});

	// хранит ссылку на подписку, чтобы потом вручную отписаться
	searchFormSub!: Subscription;

	// селектор из NGRX стора (берёт значение searchTerm из глобального состояния)
	// observable, который эмитит новое значение при каждом изменении в сторе
	searchTerm$ = this.store.select(selectSearchTerm);

	constructor() {
		// 1) Подписка на searchTerm$ → берём значение из стора и заливаем в форму
		this.searchTerm$
			.pipe(takeUntilDestroyed()) // авто-отписка → вручную unsubscribe делать не нужно)
			// searchTerm$ без авто-отписки → нужна ручная отписка (либо переделать takeUntilDestroyed и сделать авто-отписка)
			.subscribe((term) =>
				this.searchForm.patchValue(
					{ firstName: term }, // обновляем поле "Имя" в форме значением из стора
					{ emitEvent: false }, // запрещаем триггерить valueChanges → чтобы не было лишнего диспатча
				),
			);

		// 2) Подписка на изменения формы
		this.searchFormSub = this.searchForm.valueChanges
			.pipe(
				startWith(this.searchForm.value), // сразу взять текущее значение формы при инициализации
				debounceTime(500), // ждать 0.5s, чтобы не стрелять диспатч на каждую букву
			)
			.subscribe((formValue) => {
				// отправляем фильтрацию в стор
				this.store.dispatch(
					profileActions.filterEvents({ filters: formValue }),
				);

				// сохраняем имя в стор → нужно для восстановления при переходе между страницами
				this.store.dispatch(
					profileActions.setSearchTerm({ term: formValue.firstName || '' }),
				);
			});
	}

	ngOnDestroy() {
		this.searchFormSub.unsubscribe(); // ручная отписка
		// ручная отписка нужна ТОЛЬКО потому, что выше в пункт 2 идет без takeUntilDestroyed
		// иначе останется "висячая" подписка → утечка памяти
	}
}
