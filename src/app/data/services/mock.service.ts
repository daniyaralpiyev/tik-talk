import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

interface Feature {
	code: string;
	label: string;
	value: boolean;
}

@Injectable({
	providedIn: 'root',
})
export class MockService {
	getAddresses() {
		return of([
			{
				city: 'Prague',
				street: 'Wenceslas Square',
				building: 12,
				apartment: 5,
			},
			{
				city: 'Prague',
				street: 'Charles Street',
				building: 45,
				apartment: 10,
			},
		]);
	}

	getFeatures(): Observable<Feature[]> {
		return of([
			{
				code: 'lift',
				label: 'Подъем на этаж',
				value: true,
			},
			{
				code: 'strong-package',
				label: 'Усиленная установка',
				value: true,
			},
			{
				code: 'strong-fast',
				label: 'Усиленная установка',
				value: false,
			},
		]);
	}
}
