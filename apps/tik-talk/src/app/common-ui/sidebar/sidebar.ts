import {Component, inject} from '@angular/core';
import {SubscriberCard} from './subscriber-card/subscriber-card';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {firstValueFrom} from 'rxjs';
import {CustomDirectives} from '../directives/custom-directives';
import {ImgUrlPipe, SvgIcon} from '@tt/common-ui';
import {ProfileService} from '@tt/profile';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SvgIcon, SubscriberCard, RouterLink, AsyncPipe, ImgUrlPipe, RouterLinkActive, CustomDirectives],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  profileService = inject(ProfileService);
  subscribers$ = this.profileService.getSubscribersShortList();

  me = this.profileService.me

  menuItems = [
    {
      id: 1,
      label: 'Моя Страница',
      icon: 'home',
      link: 'profile/me'
    },
    {
      id: 2,
      label: 'Пользователь',
      icon: 'user',
      link: 'users'
    },
    {
      id: 3,
      label: 'Чаты',
      icon: 'chat',
      link: 'chats'
    },
    {
      id: 4,
      label: 'Поиск',
      icon: 'search',
      link: 'search'
    },
  ]

  ngOnInit() {
    firstValueFrom(this.profileService.getMe())
  }

  colorProperty = 'orange'

  setColor(newColor: string) {
    this.colorProperty = newColor;
  }
}
