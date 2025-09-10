import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {ImgUrlPipe} from '@tt/common-ui';
import {ProfileService} from '@tt/profile';

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
