export interface ChatWSMessageBase {
  status: 'success' | 'error'; // Часто означает результат обработки (входящих/исходящих) — успех или ошибка.
}

export interface ChatWSUnreadMessage extends ChatWSMessageBase {
  action: 'unread' // литеральный тип со значением ровно 'unread'.
  data: {
    count: number
  }
}

export interface ChatWSNewMessage extends ChatWSMessageBase {
  action: 'message' // action — литерал 'message'. Позволяет распознать, что это новое сообщение (входящее событие).
  data: { // объект с полями, описывающими само сообщение.
    id: number // уникальный идентификатор этого сообщения (типично — серверный id).
    message: string // текст сообщения.
    chat_id: number // идентификатор чата (в каком чате пришло сообщение).
    created_at: string // время создания сообщения в виде строки. Тип string — значит дата не преобразована в Date на уровне типа.
    author: number // id пользователя, который отправил сообщение (числовой идентификатор).
  }
}

export interface ChatWSError extends ChatWSMessageBase {
  message: string
}

export interface ChatWSSendMessage {
  text: string // текст для отправки.
  chat_id: number // id чата, в который отправляется сообщение.
}

export type ChatWSMessage = ChatWSUnreadMessage | ChatWSNewMessage | ChatWSError | ChatWSSendMessage
