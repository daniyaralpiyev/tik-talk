import {Component, inject, input, signal} from '@angular/core';
import {ChatWorkspaceMessage} from './chat-workspace-message/chat-workspace-message';
import {MessageInput} from '../../../../common-ui/message-input/message-input';
import {ChatsService} from '../../../../data/services/chats.service';
import {Chat, Message} from '../../../../data/interfaces/chats.interface';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [
    ChatWorkspaceMessage,
    MessageInput
  ],
  templateUrl: './chat-workspace-messages-wrapper.html',
  styleUrl: './chat-workspace-messages-wrapper.scss'
})
export class ChatWorkspaceMessagesWrapper {
  chatsService = inject(ChatsService)

  chat = input.required<Chat>()

  messages = signal<Message[]>([])

  onInit() {
    this.messages.set(this.chat().messages)
  }

  async onSendMessage(messageText: string) {
    await firstValueFrom(
      this.chatsService.sendMessage(this.chat().id, messageText)
    )

    const chat = await firstValueFrom(
      this.chatsService.getChatById(this.chat().id)
    )

    this.messages.set(chat.messages)
  }
}
