export interface ChatConnectionWSParams {
  url: string;
  token: string;
  handleMessage: (message: unknown) => void;
}

export interface ChatWSService {
  connect:(params: ChatConnectionWSParams) => void;
  sendMessage: (text: string, chatId: number) => void;
  disconnect:() => void;
}
