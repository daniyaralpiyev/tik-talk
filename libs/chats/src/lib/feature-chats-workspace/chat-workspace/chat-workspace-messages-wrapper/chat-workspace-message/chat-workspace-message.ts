import {Component, HostBinding, input} from '@angular/core';
import {AvatarCircle} from '@tt/common-ui';
import {CustomRelativeDatePipe} from '../../../../../../../common-ui/src/lib/pipes/date-text-ago-pipe';
import {UtcPlus5Pipe} from '../../../../../../../common-ui/src/lib/pipes/date-time-pipe';
import {Message} from '@tt/chats';

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
