import { Component } from '@angular/core';
import { map, scan, tap, timer } from 'rxjs';
import { RouterLink } from '@angular/router';
import { DestroyService } from './destroy.service';
import { toSignal } from '@angular/core/rxjs-interop';

function factorialize(n: number): number {
	return n <= 1 ? 1 : n * factorialize(n - 1);
}

@Component({
	selector: 'app-subject-rxjs',
	imports: [RouterLink],
	templateUrl: './subject-rxjs.html',
	styleUrl: './subject-rxjs.scss',
	providers: [DestroyService],
})
export class SubjectRxjs {
	obs$ = timer(0, 100).pipe(
		map((val) => {
			return factorialize(val * 10);
		}),
		scan((acc, curr) => {
			return acc + curr;
		}, 0),
		tap((val) => console.log(val)),
	);

	sig = toSignal(this.obs$)
}
