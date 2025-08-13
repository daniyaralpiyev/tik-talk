import {Component, ElementRef, HostListener, inject, input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ChatWorkspaceMessage} from './chat-workspace-message/chat-workspace-message';
import {MessageInput} from '../../../../common-ui/message-input/message-input';
import {ChatsService} from '../../../../data/services/chats.service';
import {Chat, Message} from '../../../../data/interfaces/chats.interface';
import {firstValueFrom, fromEvent, Subject, timer} from 'rxjs';
import {debounceTime, switchMap, takeUntil} from 'rxjs/operators';
import {DateTime} from 'luxon';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [
    ChatWorkspaceMessage,
    MessageInput
  ],
  templateUrl: './chat-workspace-messages-wrapper.html',
  styleUrl: './chat-workspace-messages-wrapper.scss'
})
export class ChatWorkspaceMessagesWrapper implements OnInit {
  chatsService = inject(ChatsService)
  chat = input.required<Chat>()
  messages = this.chatsService.activeChatMessages

  hostElement = inject(ElementRef)
  r2 = inject(Renderer2)

  private destroy$ = new Subject<void>;

  ngOnInit() {
    this.messagePolling();
  }

  // Периодическое обновление чата
  private messagePolling() {
    timer(0, 1800000) // Запуск сразу (0) и затем каждый 30 мин
      .pipe(takeUntil(this.destroy$)) // Завершение подписки при уничтожении компонента
      .subscribe(async () => {
        await firstValueFrom(this.chatsService.getChatById(this.chat().id));
        // Возможно, вам нужно обновить массив сообщений вручную, если он не обновляется автоматически
      });
  }

  // Метод для отправки сообщения
  async onSendMessage(messageText: string) {
    await firstValueFrom(this.chatsService.sendMessage(this.chat().id, messageText))
    await firstValueFrom(this.chatsService.getChatById(this.chat().id))
  }

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

  getGroupedMessages() {
    const messagesArray = this.messages(); // Получение актуального значения массива сообщений
    const groupedMessages = new Map(); // Карта для хранения сгруппированных сообщений, структуру ключ/значение.

    // Получение текущей даты и даты вчера
    const today = DateTime.now().startOf('day');
    const yesterday = today.minus({days: 1}); // получаем начало «вчерашнего» дня.

    messagesArray.map(message => {
      const messageDate = DateTime.fromISO(message.createdAt, {zone: 'utc'})
        .setZone(DateTime.local().zone)
        .startOf('day');

      let dateLabel;
      if (messageDate.equals(today)) {
        dateLabel = 'Сегодня';
      } else if (messageDate.equals(yesterday)) {
        dateLabel = 'Вчера';
      } else {
        dateLabel = messageDate.toFormat('dd.MM.yyyy');
      }

      groupedMessages.set(
        dateLabel,
        [...(groupedMessages.get(dateLabel) ?? []), message]
      );
    });

    return Array.from(groupedMessages.entries()); // Возвращает массив пар [дата, сообщения]
  }

  // Scroll всегда внизу
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef; // навешиваем в шаблоне селектор messagesContainer

  scrollToBottom() {
    const el = this.messagesContainer.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
}
