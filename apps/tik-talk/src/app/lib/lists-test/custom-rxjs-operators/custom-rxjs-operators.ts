import { Component } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, OperatorFunction,
	tap,
	timer,
} from 'rxjs';

function squaring(): MonoTypeOperatorFunction<number> {
	return (source) => {
		return new Observable(observer => {
			return source.subscribe({
				next: val => observer.next(Math.pow(val, 2)),
				error: err => observer.error(err),
				complete: () => observer.complete()
			})
		})
	}
}

function customMap<T, K>(mapper: (val: T) => K): OperatorFunction<T, K> {
	return (source) => {
		return new Observable(observer => {
			return source.subscribe({
				next: val => observer.next(mapper(val)),
				error: err => observer.error(err),
				complete: () => observer.complete()
			})
		})
	}
}

@Component({
	selector: 'app-custom-rxjs-operators',
	imports: [],
	templateUrl: './custom-rxjs-operators.html',
	styleUrl: './custom-rxjs-operators.scss',
})
export class CustomRxjsOperators {
	constructor() {
		timer(0, 1000)
			.pipe(
				tap(val => console.log('Before', val)),
				customMap(val => val * val),
				squaring()
			)
			// .subscribe(val => console.log('After', val));
	}
}
