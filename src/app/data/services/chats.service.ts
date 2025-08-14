import {inject, Injectable, input, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Chat, LastMessageRes, Message} from '../interfaces/chats.interface';
import {ProfileService} from './profile-service';
import {firstValueFrom, map, Subject, timer} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  http = inject(HttpClient);
  me = inject(ProfileService).me;

  activeChatMessages = signal<Message[]>([])

  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  chatsUrl = `${this.baseApiUrl}chat/`;
  messageUrl = `${this.baseApiUrl}message/`;

  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {})
  }

  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`);
  }

  getChatById(chatId: number) { // Метод: получить чат по ID
    return this.http.get<Chat>(`${this.chatsUrl}${chatId}`) // HTTP GET, ожидаем Chat
      .pipe( // Подключаем RxJS-операторы
        map(chat => { // Преобразуем ответ сервера
          const patchedMessages = chat.messages.map(message => { // Обогащаем каждое сообщение
            return {
              ...message, // Копируем поля сообщения
              user: chat.userFirst.id === message.userFromId // Определяем автора сообщения
                ? chat.userFirst : chat.userSecond,
              isMine: message.userFromId === this.me()!.id, // Флаг: моё ли сообщение
            }
          })

          this.activeChatMessages.set(patchedMessages) // Обновляем сигнал/стор сообщений

          return {
            ...chat, // Копируем поля чата
            companion: // Вычисляем собеседника
              chat.userFirst.id === this.me()!.id ? chat.userSecond : chat.userFirst,
            messages: patchedMessages // Подменяем сообщения на обогащённые (сообщения с дополнительными данными)
          }
        })
      )
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post(`${this.messageUrl}send/${chatId}`, {}, {
      params: {
        message
      }
    })
  }
}
