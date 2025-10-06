import { Component, computed, inject, OnInit, DestroyRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom, interval, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { SubscriberCard } from './subscriber-card/subscriber-card';
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
    CustomDirectives,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  // Инъекции зависимостей
  private profileService = inject(ProfileService);
  private chatsService = inject(ChatsService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  // Сигналы и вычисляемые значения
  subscribers$ = this.profileService.getSubscribersShortList(); // список подписчиков
  unreadCount = computed(() => this.chatsService.unreadCount()); // число непрочитанных сообщений
  me = this.profileService.me; // данные текущего пользователя

  // Элементы меню сайдбара
  menuItems = [
    { id: 1, label: 'Моя Страница', icon: 'home', link: 'profile/me' },
    { id: 3, label: 'Чаты', icon: 'chat', link: 'chats' },
    { id: 4, label: 'Поиск', icon: 'search', link: 'search' },
  ];

  // Прочие свойства
  colorProperty = 'orange';
  statusMessage = ''; // отображение состояния (например, подключён / ошибка)

  // Изменение цвета интерфейса (пример дополнительного поведения)
  setColor(newColor: string) {
    this.colorProperty = newColor;
  }

  // Основной жизненный цикл
  async ngOnInit() {
    try {
      // Получаем данные профиля
      await firstValueFrom(this.profileService.getMe());
      this.statusMessage = '👤 Профиль получен';

      // Подключаем WebSocket с актуальным токеном
      await this.connectWSWithTokenRefresh();

      // Запускаем автообновление токена каждые 5 минут
      this.startTokenRefreshLoop();
    } catch (err) {
      // В случае ошибки выходим из аккаунта
      this.authService.logout();
      this.statusMessage = `Ошибка инициализации Sidebar: ${err}`;
    }
  }

  // Подключение WebSocket с предварительным обновлением токена
  private async connectWSWithTokenRefresh() {
    try {
      // Обновляем токен перед подключением
      await firstValueFrom(this.authService.refreshAuthToken());

      // Отключаем предыдущее соединение (если было)
      this.chatsService.wsAdapter.disconnect?.();

      // Подключаем новое соединение с актуальным токеном
      this.chatsService.wsAdapter.connect({
        url: `${this.chatsService.baseApiUrl}chat/ws`,
        token: this.authService.token ?? '',
        handleMessage: this.chatsService.handleWSMessage,
      });

      this.statusMessage = 'WebSocket успешно подключён после обновления токена';
    } catch (err) {
      // В случае ошибки — разлогиниваем пользователя
      this.authService.logout();
      this.statusMessage = `Ошибка обновления токена или подключения WS: ${err}`;
    }
  }

  // === Цикл автообновления токена ===
  private startTokenRefreshLoop() {
    interval(5 * 60 * 1000) // интервал 5 минут
      .pipe(
        takeUntilDestroyed(this.destroyRef), // останавливается при уничтожении компонента
        switchMap(() => this.authService.refreshAuthToken()) // обновляем токен
      )
      .subscribe({
        // успешное обновление
        next: async () => {
          await this.reconnectWebSocket(); // переподключаем WS с новым токеном
          this.statusMessage = '🔁 Токен обновлён и WS переподключён';
        },
        // при ошибке обновления
        error: (err) => {
          this.authService.logout();
          this.statusMessage = `Ошибка при автообновлении токена: ${err}`;
        },
      });
  }

  // Переподключение WebSocket при обновлении токена
  private async reconnectWebSocket() {
    try {
      // Закрываем старое соединение
      this.chatsService.wsAdapter.disconnect?.();

      // Подключаем заново с актуальным токеном
      this.chatsService.wsAdapter.connect({
        url: `${this.chatsService.baseApiUrl}chat/ws`,
        token: this.authService.token ?? '',
        handleMessage: this.chatsService.handleWSMessage,
      });

      this.statusMessage = 'WebSocket успешно переподключён';
    } catch (err) {
      this.statusMessage = `Ошибка переподключения WebSocket: ${err}`;
    }
  }
}
