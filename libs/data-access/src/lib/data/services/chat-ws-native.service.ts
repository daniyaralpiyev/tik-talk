import {ChatConnectionWSParams, ChatWSService} from '../interfaces/chata-ws-service.interface';

export class ChatWsNativeService  implements ChatWSService {

  _socket: WebSocket | null = null;

  connect(params: ChatConnectionWSParams) {
    if (this._socket) return

    this._socket = new WebSocket(params.url, params.token);

    this._socket.onmessage = (event: MessageEvent) => {
      params.handleMessage(JSON.parse(event.data))
    }

    this._socket.onclose = () => {
      console.log('Кино давно кончилось!')
    }
  };

  sendMessage(text: string, chatId: number) {
    this._socket?.send(
      // парсим наш объект в строку
      JSON.stringify({
        text,
        chatId: chatId,
      })
    );
  };

  disconnect() {
    this._socket?.close();
  };
}
