import { Component, OnInit, output } from '@angular/core';

@Component({
	selector: 'tt-infinite-scroll-trigger',
	imports: [],
	templateUrl: './infinite-scroll-trigger.component.html',
	styleUrl: './infinite-scroll-trigger.component.scss',
})
export class InfiniteScrollTrigger implements OnInit {

	loaded = output<void>()

	ngOnInit(): void {
		this.loaded.emit()
	}
}
