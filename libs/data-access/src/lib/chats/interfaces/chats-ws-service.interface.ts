import {ChatWSMessage} from './chat-ws-message.interface';
import {Observable} from 'rxjs';

export interface ChatConnectionWSParams {
  url: string;
  token: string;
  handleMessage: (message: ChatWSMessage) => void;
}

export interface ChatWSService {
  connect:(params: ChatConnectionWSParams) => void | Observable<ChatWSMessage>;
  sendMessage: (text: string, chat_id: number) => void;
  disconnect:() => void;
}
