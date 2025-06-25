import {Component, inject} from '@angular/core';
import {ProfileCard} from '../../common-ui/profile-card/profile-card';
import {ProfileService} from '../../data/services/profile-service';
import {Profile} from '../../data/interfaces/profile.interface';

@Component({
  selector: 'app-search-page',
  imports: [
    ProfileCard
  ],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss'
})
export class SearchPage {
  profileService = inject(ProfileService);  // Инъекция сервиса
  profiles: Profile[] = [];  // Массив для хранения данных которые получит от метода getTestAccounts в profileService

  constructor() {
    this.profileService.getTestAccounts()  // Вызов метода сервиса
      .subscribe(value => {  // Подписка на Observable на поток данных. (просто Observable в ангуляр не видно)
        this.profiles = value;  // При получении данных (value) они сохраняются в this.profiles.
      })
  }
}
