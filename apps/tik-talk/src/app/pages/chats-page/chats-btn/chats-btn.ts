import { Component, input } from '@angular/core';
import {
  Chat,
  LastMessageRes
} from '../../../data/interfaces/chats.interface';
import { CustomRelativeDatePipe } from '../../../../../../../libs/common-ui/src/lib/pipes/date-text-ago-pipe';
import {AvatarCircle, SvgIcon} from '@tt/common-ui';

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
