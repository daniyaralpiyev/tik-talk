import {ChatWSMessage} from './chat-ws-message.interface';

export interface ChatConnectionWSParams {
  url: string;
  token: string;
  handleMessage: (message: ChatWSMessage) => void;
}

export interface ChatWSService {
  connect:(params: ChatConnectionWSParams) => void;
  sendMessage: (text: string, chat_id: number) => void;
  disconnect:() => void;
}
