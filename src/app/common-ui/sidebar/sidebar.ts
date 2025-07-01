import {Component, inject} from '@angular/core';
import {SvgIcon} from '../svg-icon/svg-icon';
import {SubscriberCard} from './subscriber-card/subscriber-card';
import {RouterLink} from '@angular/router';
import {ProfileService} from '../../data/services/profile-service';
import {AsyncPipe, JsonPipe} from '@angular/common';
import {firstValueFrom} from 'rxjs';
import {ImgUrlPipe} from '../../helpers/pipes/img-url-pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SvgIcon, SubscriberCard, RouterLink, AsyncPipe, JsonPipe, ImgUrlPipe],
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
      link: ''
    },
    {
      id: 2,
      label: 'Чаты',
      icon: 'chat',
      link: 'chat'
    },
    {
      id: 3,
      label: 'Поиск',
      icon: 'search',
      link: 'search'
    },
  ]

  ngOnInit() {
    firstValueFrom(this.profileService.getMe())
  }
}
