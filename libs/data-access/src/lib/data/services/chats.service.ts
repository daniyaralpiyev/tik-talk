import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import {Chat, ProfileService } from '../index';
import {LastMessageRes, Message} from '../interfaces/chats.interface';


@Injectable({
	providedIn: 'root',
})
export class ChatsService {
	http = inject(HttpClient);
	me = inject(ProfileService).me;

	activeChatMessages = signal<Message[]>([]);

	baseApiUrl = 'https://icherniakov.ru/yt-course/';
	chatsUrl = `${this.baseApiUrl}chat/`;
	messageUrl = `${this.baseApiUrl}message/`;

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
