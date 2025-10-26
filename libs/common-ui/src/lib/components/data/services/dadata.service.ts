import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DATATA_TOKEN } from './DADATA_TOKEN';
import { map } from 'rxjs';
import { DadataSuggestion } from '../interfaces/dadata.interface';

@Injectable({
	providedIn: 'root',
})
export class DadataService {
	_apiUrl = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address"
	_http = inject(HttpClient)

	getSuggestion(query: string) {
		return this._http.post<{suggestions: DadataSuggestion[]}>(
			this._apiUrl,
			{query},
			{ headers: {
				Authorization: `Token ${DATATA_TOKEN}`
			} }
		).pipe(
			map(res => {
				return res.suggestions;
				// return Array.from(
				// 	new Set(
				// 		res.suggestions.map((suggestion: DadataSuggestion) => {
				// 			return suggestion.data.city
				// 		})
				// 	)
				// )
			})
		)
	}
}
