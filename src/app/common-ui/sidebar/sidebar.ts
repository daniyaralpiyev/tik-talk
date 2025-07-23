import {Component, inject} from '@angular/core';
import {SvgIcon} from '../svg-icon/svg-icon';
import {SubscriberCard} from './subscriber-card/subscriber-card';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {ProfileService} from '../../data/services/profile-service';
import {AsyncPipe} from '@angular/common';
import {firstValueFrom} from 'rxjs';
import {ImgUrlPipe} from '../../helpers/pipes/img-url-pipe';
import {CustomDirectives} from '../directives/custom-directives';

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
      link: 'chat'
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
