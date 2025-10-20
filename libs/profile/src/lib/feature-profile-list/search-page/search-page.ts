import {
	Component,
	ElementRef,
	HostListener,
	inject,
	Renderer2,
	AfterViewInit,
	ChangeDetectionStrategy,
} from '@angular/core';
import { firstValueFrom, fromEvent, scan, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProfileCard } from '../../ui';
import { ProfileFilters } from '../index';
import { Store } from '@ngrx/store';
import { profileActions, selectFilteredProfiles } from '../../data';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Profile, ProfileService } from '@tt/data-access';

@Component({
	selector: 'app-search-page',
	imports: [
		ProfileCard,
		ProfileFilters,
		InfiniteScrollDirective,
	],
	templateUrl: './search-page.html',
	styleUrl: './search-page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPage {
	// --- Внедрение зависимостей ---
	store = inject(Store);
	profileService = inject(ProfileService);

	// --- Достаём список профилей из стора ---
	profiles = this.store.selectSignal(selectFilteredProfiles);

	// --- Поток для ручного добавления новых профилей (RxJS) ---
	profileSubjects$ = new Subject<Profile[]>();

	// Вариант 1: бесконечный скрол через IntersectionObserver
	onIntersection(entries: IntersectionObserverEntry[]) {
		if (!entries.length) return;

		// Если элемент появился в зоне видимости — грузим следующую страницу
		if (entries[0].intersectionRatio > 0) {
			this.timeToFetch();
		}
	}

	// Отправляем экшен для загрузки следующей страницы
	timeToFetch() {
		this.store.dispatch(profileActions.setPage({}));
	}

	// Вариант 2: бесконечный скрол через ngx-infinite-scroll
	onScroll() {
		// Запрашиваем следующую страницу профилей
		this.getNextPage();
		// И диспатчим экшен для обновления стора
		this.timeToFetch();
	}

	// Код из бонусного ролика (ручное накопление данных через RxJS)
	// Аккумулируем все подгруженные профили в одном массиве
	infiniteProfiles$ = this.profileSubjects$.pipe(
		scan((acc, curr) => acc.concat(curr) as Profile[], [] as Profile[]),
	);

	page = 0;

	ngOnInit() {
		// При инициализации — сразу грузим первую страницу
		this.getNextPage();
	}

	// Загружает новую страницу профилей напрямую через сервис
	async getNextPage() {
		this.page += 1;
		const res = await firstValueFrom(
			this.profileService.filterProfiles({ page: this.page }),
		);

		// Добавляем новые профили в поток
		this.profileSubjects$.next(res.items);
	}

	// Управление высотой блока (адаптация под высоту окна)
	hostElement = inject(ElementRef);
	r2 = inject(Renderer2);

	// Слушаем изменение размера окна
	@HostListener('window:resize')
	onWindowResize() {
		this.resizeFeed();
	}

	ngAfterViewInit() {
		// При старте компонента — задаём корректную высоту
		this.resizeFeed();

		// Подписка на ресайз окна с задержкой
		fromEvent(window, 'resize').pipe(debounceTime(1000)).subscribe();
	}

	// Вычисляем и задаём высоту блока ленты
	resizeFeed() {
		const { top } = this.hostElement.nativeElement.getBoundingClientRect();
		const height = window.innerHeight - top - 24 - 24; // отступы
		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
	}
}
