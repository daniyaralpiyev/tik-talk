import {Component, ElementRef, HostListener, inject, Renderer2, AfterViewInit, ChangeDetectionStrategy} from '@angular/core';
import { firstValueFrom, fromEvent, scan, Subject } from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {ProfileCard} from '../../ui';
import { ProfileFilters } from '../index';
import {Store} from '@ngrx/store';
import { profileActions, selectFilteredProfiles } from '../../data';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Profile, ProfileService } from '@tt/data-access';

@Component({
	selector: 'app-search-page',
	imports: [ProfileCard, ProfileFilters, InfiniteScrollDirective],
	templateUrl: './search-page.html',
	styleUrl: './search-page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPage {
	store = inject(Store);
	profileService = inject(ProfileService);
	profiles = this.store.selectSignal(selectFilteredProfiles);

	profileSubjects$ = new Subject<Profile[]>();

	// Бесконечный скрол Intersection observer
	onIntersection(entries: IntersectionObserverEntry[]) {
		if (!entries.length) return;

		if (entries[0].intersectionRatio > 0) {
			this.timeToFetch();
		}
	}

	timeToFetch() {
		this.store.dispatch(profileActions.setPage({}));
	}

	// Бесконечный скрол ngx-infinite-scroll
	onScroll() {
		console.log('scroll');
		this.getNextPage();
		this.timeToFetch();
	}

	// *************************
	// код из бонусного ролика cd с 37 минуты
	infiniteProfiles$ = this.profileSubjects$.pipe(
		scan((acc, curr) => {
			return acc.concat(curr) as Profile[];
		}, [] as Profile[]),
	);

	page = 0;

	ngOnInit() {
		this.getNextPage();
	}

	async getNextPage() {
		this.page += 1;
		const res = await firstValueFrom(
			this.profileService.filterProfiles({ page: this.page }),
		);

		this.profileSubjects$.next(res.items);
	}
	// *************************

	hostElement = inject(ElementRef);
	r2 = inject(Renderer2);

	@HostListener('window:resize')
	onWindowResize() {
		this.resizeFeed();
	}

	ngAfterViewInit() {
		this.resizeFeed();

		fromEvent(window, 'resize').pipe(debounceTime(1000)).subscribe();
	}

	resizeFeed() {
		const { top } = this.hostElement.nativeElement.getBoundingClientRect();

		const height = window.innerHeight - top - 24 - 24;

		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
	}
}
