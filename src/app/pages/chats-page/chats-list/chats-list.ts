import {Component, inject} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ChatsBtn} from '../chats-btn/chats-btn';
import {ChatsService} from '../../../data/services/chats.service';
import {AsyncPipe} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-chats-list',
  imports: [
    ReactiveFormsModule,
    ChatsBtn,
    AsyncPipe,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './chats-list.html',
  styleUrl: './chats-list.scss'
})
export class ChatsList {
  chatsService = inject(ChatsService);

  chats$ = this.chatsService.getMyChats()
}
