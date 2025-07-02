import {Component, inject} from '@angular/core';
import {ProfileHeader} from '../../common-ui/profile-header/profile-header';
import {ProfileService} from '../../data/services/profile-service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {toObservable} from '@angular/core/rxjs-interop';
import {AsyncPipe} from '@angular/common';
import {SvgIcon} from '../../common-ui/svg-icon/svg-icon';
import {ImgUrlPipe} from '../../helpers/pipes/img-url-pipe';
import {PostFeed} from './post-feed/post-feed';

@Component({
  selector: 'app-profile-page',
  imports: [
    ProfileHeader,
    AsyncPipe,
    SvgIcon,
    RouterLink,
    ImgUrlPipe,
    PostFeed
  ],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss'
})
export class ProfilePage {
  profileService = inject(ProfileService);
  route = inject(ActivatedRoute);

  me$ = toObservable(this.profileService.me)
  subscribers$ = this.profileService.getSubscribersShortList(5);

  profile$ = this.route.params
    .pipe(
      switchMap(({id})=> {
        if (id ==='me') return this.me$

        return this.profileService.getAccount(id)
      })
    )
}
