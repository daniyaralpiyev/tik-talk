import {Component, ElementRef, HostListener, inject, Renderer2} from '@angular/core';
import {ProfileCard} from '../../common-ui/profile-card/profile-card';
import {ProfileFilters} from './profile-filters/profile-filters';
import {fromEvent} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {ProfileService} from '@tt/profile';

@Component({
  selector: 'app-search-page',
  imports: [
    ProfileCard,
    ProfileFilters,
  ],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss'
})
export class SearchPage {
  profileService = inject(ProfileService);  // Инъекция сервиса
  profiles = this.profileService.filteredProfiles

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
