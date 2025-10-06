import {ChatConnectionWSParams, ChatWSService} from './chata-ws-service.interface';
import {WebSocketSubject} from 'rxjs/internal/observable/dom/WebSocketSubject';
import {ChatWSMessage} from './chat-ws-message.interface';
import {webSocket} from 'rxjs/webSocket';
import {finalize, Observable, tap} from 'rxjs';

// Класс реализует интерфейс ChatWSService с использованием RxJS
export class ChatWSRxjsService implements ChatWSService {

  // Храним WebSocketSubject (RxJS-обертка над WebSocket)
  _socket: WebSocketSubject<ChatWSMessage> | null = null;

  // Метод подключения к серверу и подписки на поток сообщений
  connect(params: ChatConnectionWSParams): Observable<ChatWSMessage> {
    // Если соединение ещё не установлено
    if (!this._socket) {
      // Создаём новое WebSocket-подключение
      this._socket = webSocket({
        url: params.url, // URL сервера
        protocol: [params.token], // Токен авторизации передаётся как протокол
      })
    }

    // Возвращаем поток сообщений как Observable
    return this._socket.asObservable()
      .pipe(
        // Обрабатываем каждое сообщение через переданный колбэк
        tap(message => params.handleMessage(message)),
        // Вызывается при закрытии соединения
        finalize(() => console.log('Кино давно кончилось!'))
      )
  }

  // Метод отправки сообщения на сервер
  sendMessage(text: string, chat_id: number) {
    // Отправляем объект через WebSocketSubject
    this._socket?.next({
      text, // Текст сообщения
      chat_id: chat_id, // ID чата
    })
  }

  // Метод для завершения соединения
  disconnect() {
    // Закрываем WebSocket корректно через RxJS
    this._socket?.complete();
  }
}
