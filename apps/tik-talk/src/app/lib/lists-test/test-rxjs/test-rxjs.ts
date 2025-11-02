import { Component, inject } from '@angular/core';
import {
	catchError,
	finalize,
	fromEvent,
	interval,
	map,
	Observable,
	of,
	shareReplay,
	take,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '@tt/data-access';

function customFromEvent(el: HTMLElement, eventName: string) {
	return new Observable((subscriber) => {

		const handleEvent = (e: Event) => subscriber.next(e)

		el.addEventListener(eventName, handleEvent)

		return () => {
			console.log('DESTROYING');
			el.removeEventListener(eventName, handleEvent)
		}
	})
}

function customTimer(interval: number) {
	return new Observable(subscriber => {
		let i = 0

		const intId = setInterval(() => {
			subscriber.next(i++)
			console.log('INSIDE INTERVAL', i);
		}, interval)

		return () => {
			console.log('DESTROYING');
			clearInterval(intId)
		}
		})
}

function random() {
	return new Observable((subscriber) => {
		const random = Math.random()
		if (random > 0.6) subscriber.error()
		if (random > 0.8) subscriber.complete()
		subscriber.next(random)
	})
}

@Component({
	selector: 'app-test-rxjs',
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './test-rxjs.html',
	styleUrl: './test-rxjs.scss',
})
export class TestRxjs {
	profileService = inject(ProfileService)

	account$ = this.profileService.getTestAccounts()
		.pipe(shareReplay())

	constructor() {

		const obs = random()

		const abc = obs
			.pipe(
				catchError(err => {
					return of(null)
				}),
				finalize(() => null)
			)

		abc.subscribe()
	}

	// constructor() {
	// 	customFromEvent(document.body, 'click')
	// 		.pipe(
	// 			take(10)
	// 		)
	// 		.subscribe(val => {
	// 			console.log(val);
	// 		})
	//
	// 	const sub = customTimer(2000)
	// 		.subscribe(val => console.log(val))
	//
	// 	setTimeout(() => {
	// 		sub.unsubscribe()
	// 	}, 4000)

		// const  obs = new Observable((subscriber) => {
		// 	subscriber.next(1)
		// 	subscriber.next(2)
		// 	subscriber.next(3)
		// 	subscriber.next(4)
		// 	subscriber.next(5)
		//
		// 	return () => {
		// 		console.log('DESTROYING');
		// 	}
		// })
		//
		// const sub = obs.subscribe(val => console.log(val))
		//
		// setTimeout(() => {
		// 	sub.unsubscribe()
		// },3000)
	// }
}
