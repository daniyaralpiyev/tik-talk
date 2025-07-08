import {Component, inject} from '@angular/core';
import {ProfileCard} from '../../common-ui/profile-card/profile-card';
import {ProfileService} from '../../data/services/profile-service';
import {ProfileFilters} from './profile-filters/profile-filters';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-search-page',
  imports: [
    ProfileCard,
    ProfileFilters,
    AsyncPipe
  ],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss'
})
export class SearchPage {
  profileService = inject(ProfileService);  // Инъекция сервиса
  profiles = this.profileService.filteredProfiles

  constructor() {

  }
}
