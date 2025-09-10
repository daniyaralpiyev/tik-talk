import {Component, inject, signal} from '@angular/core';
import {ProfileHeader} from '../../common-ui/profile-header/profile-header';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {toObservable} from '@angular/core/rxjs-interop';
import {AsyncPipe} from '@angular/common';
import {ChatsService} from '../../data/services/chats.service';
import {firstValueFrom} from 'rxjs';
import {PostFeed} from '@tt/posts';
import {ImgUrlPipe, SvgIcon} from '@tt/common-ui';
import {ProfileService} from '@tt/profile';

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
  styleUrl: './profile-page.scss'
})
export class ProfilePage {
  profileService = inject(ProfileService);
  chatsService = inject(ChatsService);
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
    firstValueFrom(this.chatsService.createChat(userId))
      .then((res) => {
        this.router.navigate(['/chats', res.id]);
      })
  }
}
