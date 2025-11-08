import {ChatConnectionWSParams, ChatWSService} from '../interfaces/chats-ws-service.interface';

export class ChatWsNativeService implements ChatWSService {

  // Приватное свойство для хранения экземпляра WebSocket; по умолчанию = null
  _socket: WebSocket | null = null;

  // Метод для подключения к WebSocket-серверу
  connect(params: ChatConnectionWSParams) {
    // Если соединение уже установлено — ничего не делаем
    if (this._socket) return

    // Создаём новый WebSocket, передаём URL и токен авторизации (вторым параметром)
    this._socket = new WebSocket(params.url, params.token);

    // Срабатывает при получении нового сообщения от сервера
    this._socket.onmessage = (event: MessageEvent) => {
      // Преобразуем строку в объект и передаём обработчику сообщений
      params.handleMessage(JSON.parse(event.data))
    }

    // Срабатывает при закрытии соединения
    this._socket.onclose = () => {
      console.log('Кино давно кончилось!')
    }
  };

  // Отправка сообщения через WebSocket
  sendMessage(text: string, chat_id: number) {
    this._socket?.send(
        // Преобразуем объект в строку перед отправкой
      JSON.stringify({text, chat_id: chat_id,})
    );
  };

  // Метод для закрытия соединения
  disconnect() {
    this._socket?.close();
  };
}
