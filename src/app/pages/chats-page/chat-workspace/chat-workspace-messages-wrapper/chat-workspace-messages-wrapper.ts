import {Component, ElementRef, HostListener, inject, input, Renderer2} from '@angular/core';
import {ChatWorkspaceMessage} from './chat-workspace-message/chat-workspace-message';
import {MessageInput} from '../../../../common-ui/message-input/message-input';
import {ChatsService} from '../../../../data/services/chats.service';
import {Chat} from '../../../../data/interfaces/chats.interface';
import {firstValueFrom, fromEvent, Subject, timer} from 'rxjs';
import {debounceTime, switchMap, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [
    ChatWorkspaceMessage,
    MessageInput
  ],
  templateUrl: './chat-workspace-messages-wrapper.html',
  styleUrl: './chat-workspace-messages-wrapper.scss'
})
export class ChatWorkspaceMessagesWrapper {
  chatsService = inject(ChatsService)
  chat = input.required<Chat>()
  messages = this.chatsService.activeChatMessages

  private destroy$ = new Subject<void>;
  hostElement = inject(ElementRef)
  r2 = inject(Renderer2)

  constructor() {
    timer(0, 1_800_000) // запуск сразу и повтор каждые 30 минут.
      .pipe(takeUntil(this.destroy$)) // Отслеживаем уничтожение компонента, чтобы остановить таймер
      .subscribe(() => { // Подписываемся на события таймера
        firstValueFrom(this.chatsService.getChatById(this.chat().id)); // Запрашиваем чат по ID
      });
  }


  // Метод для отправки сообщения
  async onSendMessage(messageText: string) {
    await firstValueFrom(
      this.chatsService.sendMessage(this.chat().id, messageText)
        .pipe(
          switchMap(() =>
            this.chatsService.getChatById(this.chat().id)
          )
        )
    );
  }
  // async onSendMessage(messageText: string) {
  //   await firstValueFrom(this.chatsService.sendMessage(this.chat().id, messageText))
  //   await firstValueFrom(this.chatsService.getChatById(this.chat().id))
  // }

  // Обработчик изменения размера окна
  @HostListener('window:resize')
  onWindowResize(): void {
    this.resizeFeed()
  }

  ngAfterViewInit() {
    this.resizeFeed() // Установка высоты при инициализации компонента

    // Подписка на изменения размера окна с дебаунсом
    fromEvent(window, 'resize')
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => {
        this.resizeFeed()
      });
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete() // Отписка для предотвращения утечек памяти
  }

  // Метод для изменения размера элемента
  resizeFeed() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect(); // Получение координат
    const height = window.innerHeight - top - 28; // Вычисление высоты
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`); // Установка стиля высоты
  }
}
