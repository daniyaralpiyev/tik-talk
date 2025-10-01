import {Component, HostBinding, input} from '@angular/core';
import {AvatarCircle, CustomRelativeDatePipe, CustomDateTimePipe} from '@tt/common-ui';
import {Message} from '@tt/data-access';

@Component({
  selector: 'app-chat-workspace-message',
  imports: [
    AvatarCircle,
    CustomRelativeDatePipe,
    CustomDateTimePipe
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
