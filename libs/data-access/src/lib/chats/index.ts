import {
	ChatWSError,
	ChatWSMessage,
	ChatWSMessageBase,
	ChatWSNewMessage,
	ChatWSSendMessage,
	ChatWSUnreadMessage,
} from './interfaces/chat-ws-message.interface';
import {
	ChatConnectionWSParams,
	ChatWSService,
} from './interfaces/chats-ws-service.interface';
import { Chat, LastMessageRes, Message } from './interfaces/chats.interface';
import { ChatWsNativeService } from './services/chat-ws-native.service';
import { ChatWSRxjsService } from './services/chat-ws-rxjs.service';
import { ChatsService } from './services/chats.service';

export {
	ChatWsNativeService,
	ChatWSRxjsService,
	ChatsService
}

export type {
	ChatWSMessageBase,
	ChatWSUnreadMessage,
	ChatWSNewMessage,
	ChatWSError,
	ChatWSSendMessage,
	ChatWSMessage,
	Chat,
	Message,
	LastMessageRes,
	ChatConnectionWSParams,
	ChatWSService
}
