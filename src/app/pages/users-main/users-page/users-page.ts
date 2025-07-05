import {Component, inject} from '@angular/core';
import {ProfileService} from '../../../data/services/profile-service';
import {AsyncPipe} from '@angular/common';
import {ImgUrlPipe} from '../../../helpers/pipes/img-url-pipe';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-users-page',
  imports: [
    AsyncPipe,
    ImgUrlPipe,
    RouterLink
  ],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss'
})
export class UsersPage {
  profileService = inject(ProfileService);
  subscribers$ = this.profileService.getSubscribersShortList(5);

}
