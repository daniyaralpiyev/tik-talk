import {Component, input} from '@angular/core';
import {AvatarCircle} from '../../../common-ui/avatar-circle/avatar-circle';
import {Chat, LastMessageResponse} from "../../../data/interfaces/chats.interface";

@Component({
  selector: 'button[chats]',
  standalone: true,
  imports: [
    AvatarCircle
  ],
  templateUrl: './chats-btn.html',
  styleUrl: './chats-btn.scss'
})
export class ChatsBtn {
  chat = input<LastMessageResponse>()
}
