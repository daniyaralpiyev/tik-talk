import { Component, computed, inject, OnInit, DestroyRef, ChangeDetectionStrategy} from '@angular/core';
import { SubscriberCard } from './subscriber-card/subscriber-card';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom, interval, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomDirectives, ImgUrlPipe, SvgIcon } from '@tt/common-ui';
import { ChatsService, ProfileService, AuthService } from '@tt/data-access';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgIcon,
    SubscriberCard,
    RouterLink,
    AsyncPipe,
    ImgUrlPipe,
    RouterLinkActive,
    CustomDirectives
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar implements OnInit {
  private profileService = inject(ProfileService);
  private chatsService = inject(ChatsService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  subscribers$ = this.profileService.getSubscribersShortList();
  unreadCount = computed(() => this.chatsService.unreadCount());
  me = this.profileService.me;

  menuItems = [
    { id: 1, label: 'Моя Страница', icon: 'home', link: 'profile/me' },
    { id: 2, label: 'Чаты', icon: 'chat', link: 'chats' },
    { id: 3, label: 'Поиск', icon: 'search', link: 'search' },
    { id: 4, label: 'Сообщества', icon: 'communities', link: 'communities' }
  ];

  colorProperty = 'orange';
  statusMessage = '';

  setColor(newColor: string) {
    this.colorProperty = newColor;
  }

  async ngOnInit() {
    try {
      // 1. Получаем профиль
      await firstValueFrom(this.profileService.getMe());
      this.statusMessage = 'Профиль успешно загружен ✅';

      // 2. Подключаем WebSocket с актуальным токеном
      this.connectWebSocket();

      // 3. Запускаем автоматическое обновление токена
      this.startTokenRefreshLoop();
    } catch (err) {
      console.error('Ошибка инициализации Sidebar:', err);
      this.authService.logout();
    }
  }

  // Подключение WebSocket
  private connectWebSocket() {
    this.chatsService.wsAdapter.connect({
      url: `${this.chatsService.baseApiUrl}chat/ws`,
      token: this.authService.token ?? '',
      handleMessage: this.chatsService.handleWSMessage,
    });
    this.statusMessage = 'WebSocket подключён ✅';
  }

  // Автообновление токена каждые 5 минут
  private startTokenRefreshLoop() {
    interval(5 * 60 * 1000)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.authService.refreshAuthToken())
      )
      .subscribe({
        next: () => {
          console.log('🔄 Токен успешно обновлён, переподключаем WS...');
          this.reconnectWebSocket();
        },
        error: (err) => {
          console.error('Ошибка автообновления токена:', err);
          this.authService.logout();
        },
      });
  }

  // Переподключение WS с новым токеном
  private reconnectWebSocket() {
    try {
      this.chatsService.wsAdapter.disconnect?.();
      this.connectWebSocket();
      this.statusMessage = 'WS переподключён 🔁';
    } catch (err) {
      console.error('Ошибка переподключения WS:', err);
    }
  }
}
