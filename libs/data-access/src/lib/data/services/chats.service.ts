import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable} from 'rxjs';
import {AuthService, Chat, ProfileService } from '../index';
import {LastMessageRes, Message} from '../interfaces/chats.interface';
import {ChatWsNativeService} from './chat-ws-native.service';
import {ChatWSService} from '../interfaces/chata-ws-service.interface';
import {ChatWSMessage} from '../interfaces/chat-ws-message.interface';
import {isNewMessage, isUnreadMessage} from '../interfaces/type-guards';
import {ChatWSRxjsService} from '../interfaces/chat-ws-rxjs.service';


@Injectable({
	providedIn: 'root',
})
export class ChatsService {
	http = inject(HttpClient);
  _authService = inject(AuthService);
	me = inject(ProfileService).me;

	activeChatMessages = signal<Message[]>([]);

  unreadCount = signal<number>(0); // 👈 Добавляем сигнал для непрочитанных

	baseApiUrl = 'https://icherniakov.ru/yt-course/';
	chatsUrl = `${this.baseApiUrl}chat/`;
	messageUrl = `${this.baseApiUrl}message/`;

  wsAdapter: ChatWSService = new ChatWsNativeService()

  connectWS() {
    this.wsAdapter.connect({
      url: `${this.baseApiUrl}chat/ws`,
      token: this._authService.token ?? '', // TODO нужно сделать чтобы токен обновлялся
      handleMessage: this.handleWSMessage
    })
  }

  // wsAdapter: ChatWSService = new ChatWSRxjsService() // Websocket RXJS RXJS
  //
  // // Websocket RXJS RXJS
  // connectWS() {
  //   return this.wsAdapter.connect({
  //     url: `${this.baseApiUrl}chat/ws`,
  //     token: this._authService.token ?? '', // TODO нужно сделать чтобы токен обновлялся
  //     handleMessage: this.handleWSMessage
  //   }) as Observable<ChatWSMessage>
  // }

  handleWSMessage = (message: ChatWSMessage) => {
    if (!('action' in message)) return;

    // ORANGE Новое сообщение
    if (isNewMessage(message)) {
      const newMsg: Message = {
        id: message.data.id,
        userFromId: message.data.author,
        personalChatId: message.data.chat_id,
        text: message.data.message,
        createdAt: message.data.created_at,
        isRead: false,
        isMine: false,
      };

      // ORANGE Если сообщение не из активного чата "считаем непрочитанным"
      this.unreadCount.update((c) => c + 1);

      // Добавляем в список активных сообщений, если нужно
      this.activeChatMessages.set([...this.activeChatMessages(), newMsg]);
    }

    // ORANGE Если сервер прислал “непрочитанные”
    if (isUnreadMessage(message)) {
      this.unreadCount.set(message.data.count ?? 0);
    }
  };

  // ORANGE Обнуляем счётчик при открытии чата
  resetUnreadCount() {
    this.unreadCount.set(0);
  }

	createChat(userId: number) {
		return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
	}

	getMyChats() {
		return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`);
	}

	getChatById(chatId: number) {
		// Метод: получить чат по ID
		return this.http
			.get<Chat>(`${this.chatsUrl}${chatId}`) // HTTP GET, ожидаем Chat
			.pipe(
				// Подключаем RxJS-операторы
				map((chat) => {
					// Преобразуем ответ сервера
					const patchedMessages = chat.messages.map((message) => {
						// Обогащаем каждое сообщение
						return {
							// Копируем поля сообщения
							...message,
							user:
								chat.userFirst.id === message.userFromId // Определяем автора сообщения
									? chat.userFirst
									: chat.userSecond,
							isMine: message.userFromId === this.me()!.id, // Флаг: моё ли сообщение
						};
					});

					// todo сгруппировать сообщения из метода getGroupedMessages чтобы в activeChatMessages за set-тить их в шаблоне
					// Уточни у Ивана на счет этого так как все работает
					this.activeChatMessages.set(patchedMessages); // Обновляем сигнал/стор сообщений

					return {
						// Копируем поля чата
						...chat,
						// Вычисляем, собеседника
						companion:
							chat.userFirst.id === this.me()!.id
								? chat.userSecond
								: chat.userFirst,
						// Подменяем сообщения на обогащённые (сообщения с дополнительными данными)
						messages: patchedMessages,
					};
				}),
			);
	}

	sendMessage(chatId: number, message: string) {
		return this.http.post(
			`${this.messageUrl}send/${chatId}`,
			{},
			{
				params: {
					message,
				},
			},
		);
	}
}
