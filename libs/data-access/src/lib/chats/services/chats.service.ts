import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Chat, LastMessageRes, Message } from '../interfaces/chats.interface';
import {ChatWsNativeService} from './chat-ws-native.service';
import {ChatWSService} from '../interfaces/chats-ws-service.interface';
import {ChatWSMessage} from '../interfaces/chat-ws-message.interface';
import {isNewMessage, isUnreadMessage} from '../../shared/interfaces/type-guards';
import {ChatWSRxjsService} from './chat-ws-rxjs.service';
import { AuthService } from '../../auth/index';
import { ProfileService } from '../../profile/services/profile-service';


@Injectable({
	providedIn: 'root',
})
export class ChatsService {
	http = inject(HttpClient);
  _authService = inject(AuthService);
	me = inject(ProfileService).me;

	activeChatMessages = signal<Message[]>([]);

  activeChat = signal<Chat | null>(null)

  unreadCount = signal<number>(0); // ORANGE Добавляем сигнал для непрочитанных

	baseApiUrl = '/yt-course/';
	chatsUrl = `${this.baseApiUrl}chat/`;
	messageUrl = `${this.baseApiUrl}message/`;

  wsAdapter: ChatWSService = new ChatWsNativeService()

  connectWS() {
    this.wsAdapter.connect({
      url: `${this.baseApiUrl}chat/ws`,
      token: this._authService.token ?? '',
      handleMessage: this.handleWSMessage
    })
  }

  // // Websocket RXJS RXJS
  // wsAdapter: ChatWSService = new ChatWSRxjsService()
	//
  // // Websocket RXJS RXJS
  // connectWS() {
  //   return this.wsAdapter.connect({
  //     url: `${this.baseApiUrl}chat/ws`,
  //     token: this._authService.token ?? '',
	// 		handleMessage: this.handleWSMessage,
	// 	}) as Observable<ChatWSMessage>;
	// }

	handleWSMessage = (message: ChatWSMessage) => { // Проверяем, содержит ли сообщение свойство action
		if (!('action' in message)) {
			console.warn('Сообщение не содержит action:', message);
			return;    }    // Проверяем, является ли сообщение новым

		if (isNewMessage(message)) { // Новое сообщение из WS

			const me = this.me();
			const activeChat = this.activeChat(); // Проверяем наличие пользователя и активного чата

			if (!me || !activeChat) return // Отсутствует информация о пользователе или активном чате

			// if (!message.data.message?.trim()) return // Пустое сообщение — пропускаем

			// Создаем новое сообщение
			const newMsg: Message = {
				id: message.data.id,
				userFromId: message.data.author,
				personalChatId: message.data.chat_id,
				text: message.data.message,
				createdAt: message.data.created_at || new Date().toISOString(),
				isRead: false,
				isMine: message.data.author === me.id,
				user: activeChat.userFirst.id === message.data.author
					? activeChat.userFirst
					: activeChat.userSecond,
			};

			// Обновляем счетчик непрочитанных сообщений
			this.unreadCount.update((c) => c + 1);
			this.activeChatMessages.set([...this.activeChatMessages(), newMsg]);
    }

		// Проверяем, является ли сообщение счетчиком непрочитанных
		if (isUnreadMessage(message)) {
			console.log('Обновляем счетчик непрочитанных сообщений:', message.data.count);
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

  // Метод: получить чат по ID
	getChatById(chatId: number) {
		return this.http
			.get<Chat>(`${this.chatsUrl}${chatId}`) // HTTP GET, ожидаем Chat
			.pipe(
        // Подключаем RxJS-операторы
				map((chat) => {
          this.activeChat.set(chat); // ORANGE сохраняем активный чат
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

					this.activeChatMessages.set(patchedMessages); // Обновляем сигнал/стор сообщений

					return {
						...chat, // Копируем поля чата
						companion: // Вычисляем, собеседника
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
      {params: { message },},
      );
	}
}
