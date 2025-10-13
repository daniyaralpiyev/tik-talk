import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ChatsList} from '../chats-list/chats-list';
import {ChatsService} from '@tt/data-access';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chats',
  imports: [
    RouterOutlet,
    ChatsList
  ],
  templateUrl: './chats.html',
  styleUrl: './chats.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsPageComponent {
  // _chatService = inject(ChatsService);
  //
  // // ngOnInit() {
  // //   this._chatService.connectWS();
  // // }
  //
  // // Websocket RXJS
  // constructor() {
  //   this._chatService.connectWS()
  //     .pipe(takeUntilDestroyed())
  //     .subscribe()
  // }

  private _chatService = inject(ChatsService);

  constructor() {
    this.connectToWebSocket();
  }

  private connectToWebSocket() {
    this._chatService.connectWS()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (message) => {
          console.log('Сообщение из WS:', message); // Логирование входящих сообщений
          },
          error: (err) => {
          console.error('Ошибка WebSocket:', err); // Логирование ошибок
          },        complete: () => {
          console.log('WebSocket соединение закрыто'); // Логирование закрытия соединения
          }
      });
  }
}
