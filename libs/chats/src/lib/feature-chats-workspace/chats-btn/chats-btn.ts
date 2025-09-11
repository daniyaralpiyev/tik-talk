import { Component, input } from '@angular/core';
import {AvatarCircle, SvgIcon} from '@tt/common-ui';
import {CustomRelativeDatePipe} from '../../../../../common-ui/src/lib/pipes/date-text-ago-pipe';
import {Chat, LastMessageRes} from '../../data';

@Component({
  selector: 'button[chats]',
  imports: [AvatarCircle, CustomRelativeDatePipe, SvgIcon],
  templateUrl: './chats-btn.html',
  styleUrl: './chats-btn.scss',
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
