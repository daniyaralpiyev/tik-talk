import {Component, HostBinding, input} from '@angular/core';
import {Message} from '../../../../../data/interfaces/chats.interface';
import {CustomRelativeDatePipe} from '../../../../../../../../../libs/common-ui/src/lib/pipes/date-text-ago-pipe';
import {UtcPlus5Pipe} from '../../../../../../../../../libs/common-ui/src/lib/pipes/date-time-pipe';
import {AvatarCircle} from '@tt/common-ui';

@Component({
  selector: 'app-chat-workspace-message',
  imports: [
    AvatarCircle,
    CustomRelativeDatePipe,
    UtcPlus5Pipe
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
