import {Component, HostBinding, input} from '@angular/core';
import {Message} from '../../../../../data/interfaces/chats.interface';
import {AvatarCircle} from '../../../../../common-ui/avatar-circle/avatar-circle';
import {DatePipe} from '@angular/common';
import {CustomRelativeDatePipe} from '../../../../../helpers/pipes/date-text-ago-pipe';

@Component({
  selector: 'app-chat-workspace-message',
  imports: [
    AvatarCircle,
    DatePipe,
    CustomRelativeDatePipe
  ],
  templateUrl: './chat-workspace-message.html',
  styleUrl: './chat-workspace-message.scss'
})
export class ChatWorkspaceMessage {
  message = input.required<Message>()

  @HostBinding('class.is-mine')
  get isMine() {
    return this.message().isMine
  }
}
