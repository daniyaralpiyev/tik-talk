import {Component, input} from '@angular/core';
import {Message} from '../../../../../data/interfaces/chats.interface';

@Component({
  selector: 'app-chat-workspace-message',
  imports: [],
  templateUrl: './chat-workspace-message.html',
  styleUrl: './chat-workspace-message.scss'
})
export class ChatWorkspaceMessage {
  message = input.required<Message>()
}
