import {Component, computed, inject, OnInit} from '@angular/core';
import {SubscriberCard} from './subscriber-card/subscriber-card';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {firstValueFrom} from 'rxjs';
import {CustomDirectives, ImgUrlPipe, SvgIcon} from '@tt/common-ui';
import {ChatsService, ProfileService} from '@tt/data-access';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SvgIcon, SubscriberCard, RouterLink, AsyncPipe, ImgUrlPipe, RouterLinkActive, CustomDirectives],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnInit {
  profileService = inject(ProfileService);
  subscribers$ = this.profileService.getSubscribersShortList();
  chatsService = inject(ChatsService); // ORANGE WS добавляем
  unreadCount = computed(() => this.chatsService.unreadCount()); // ORANGE WS реактивное значение

  me = this.profileService.me

  menuItems = [
    {
      id: 1,
      label: 'Моя Страница',
      icon: 'home',
      link: 'profile/me'
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
    this.chatsService.connectWS(); // 👈 запускаем WebSocket при загрузке
  }

  colorProperty = 'orange'

  setColor(newColor: string) {
    this.colorProperty = newColor;
  }
}
