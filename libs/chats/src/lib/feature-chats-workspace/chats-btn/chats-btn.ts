import {ChangeDetectionStrategy, Component, input } from '@angular/core';
import {AvatarCircle, CustomRelativeDatePipe, SvgIcon} from '@tt/common-ui';
import { Chat, LastMessageRes} from '@tt/data-access';

@Component({
  selector: 'button[chats]',
  imports: [AvatarCircle, CustomRelativeDatePipe, SvgIcon],
  templateUrl: './chats-btn.html',
  styleUrl: './chats-btn.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsBtn {
  chat = input<LastMessageRes>();
  message = input<Chat>();

  // Кол-во сообщении за все время
  // messageAmount = signal<Message[]>([]);
  // ngOnInit() {
  //   const messageData = this.chat()
  //   if (messageData) {
  //     this.messageAmount.set(this.message()!.messages);
  //   }
  // }
}
