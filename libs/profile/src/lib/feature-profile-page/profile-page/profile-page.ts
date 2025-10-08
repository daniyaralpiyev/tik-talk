import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {toObservable} from '@angular/core/rxjs-interop';
import {AsyncPipe} from '@angular/common';
import { ProfileService } from '@tt/data-access';
import {ProfileHeader} from '../../ui';
import {ImgUrlPipe, SvgIcon} from '@tt/common-ui';
import {PostFeed} from '@tt/posts';

@Component({
  selector: 'app-profile-page',
  imports: [
    ProfileHeader,
    AsyncPipe,
    SvgIcon,
    RouterLink,
    ImgUrlPipe,
    PostFeed,
  ],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePage {
  profileService = inject(ProfileService);
  route = inject(ActivatedRoute);
  router = inject(Router)

  me$ = toObservable(this.profileService.me)
  subscribers$ = this.profileService.getSubscribersShortList(5);

  isMyPage = signal(false) // Обновляется

  profile$ = this.route.params
    .pipe(
      // Если совпадает id или если совпадет с id которая
      // заложена в переменную me тогда моя страница(isMyPage)
      switchMap(({id})=> {
        this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id);
        if (id ==='me') return this.me$

        return this.profileService.getAccount(id)
      })
    )

  async sendMessage(userId: number) {
    this.router.navigate(['/chats', 'new'], {queryParams: {userId}});
  }
}
