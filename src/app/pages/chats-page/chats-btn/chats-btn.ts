import {Component, computed, input, OnInit, signal} from '@angular/core';
import {AvatarCircle} from '../../../common-ui/avatar-circle/avatar-circle';
import {Chat, LastMessageRes, Message} from '../../../data/interfaces/chats.interface';
import {CustomRelativeDatePipe} from '../../../helpers/pipes/date-text-ago-pipe';
import {SvgIcon} from '../../../common-ui/svg-icon/svg-icon';

@Component({
  selector: 'button[chats]',
  imports: [
    AvatarCircle,
    CustomRelativeDatePipe,
    SvgIcon
  ],
  templateUrl: './chats-btn.html',
  styleUrl: './chats-btn.scss'
})
export class ChatsBtn implements OnInit {
  chat = input<LastMessageRes>();
  message = input<Chat>();
  messageAmount = signal<Message[]>([]);

  // Кол-во непрочитанных
  unreadCount = computed(() => {
      return this.chat()?.unreadCount ?? 0
    }
  );

  ngOnInit() {
    const messageData = this.chat()
    if (messageData) {
      this.messageAmount.set(this.message()!.messages);
    }
  }
}
