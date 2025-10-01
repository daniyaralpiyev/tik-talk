import {ChatConnectionWSParams, ChatWSService} from './chata-ws-service.interface';
import {WebSocketSubject} from 'rxjs/internal/observable/dom/WebSocketSubject';
import {ChatWSMessage} from './chat-ws-message.interface';
import {webSocket} from 'rxjs/webSocket';
import {finalize, Observable, tap} from 'rxjs';

export class ChatWSRxjsService implements ChatWSService {

  _socket: WebSocketSubject<ChatWSMessage> | null = null;

  connect(params: ChatConnectionWSParams): Observable<ChatWSMessage> {
    if (!this._socket) {
      this._socket = webSocket({
        url: params.url,
        protocol: [params.token],
      })
    }


    return this._socket.asObservable()
      .pipe(
        tap(message => params.handleMessage(message)),
        finalize(() => console.log('Кино давно кончилось!'))
      )
  }

  sendMessage(text: string, chat_id: number) {
    this._socket?.next({
      text,
      chat_id: chat_id,
      }
    )
  }

  disconnect() {
    this._socket?.complete();
  }
}
