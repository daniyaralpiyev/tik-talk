import {Component, ElementRef, HostListener, inject, Renderer2, AfterViewInit} from '@angular/core';
import {fromEvent} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {ProfileCard} from '../../ui';
import { ProfileFilters } from '../index';
import {profileStore} from '../../data';

@Component({
  selector: 'app-search-page',
  imports: [
    ProfileCard,
    ProfileFilters,
  ],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss'
})
export class SearchPage implements AfterViewInit {
  store = inject(profileStore);
  profiles = this.store.profiles2;

  hostElement = inject(ElementRef)
  r2 = inject(Renderer2)

  @HostListener('window:resize')
  onWindowResize() {
    this.resizeFeed()
  }

  ngAfterViewInit() {
    this.resizeFeed()

    fromEvent(window, 'resize')
      .pipe(
        debounceTime(1000),
      )
      .subscribe()
  }

  resizeFeed() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect()

    const height = window.innerHeight - top - 24 - 24

    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
