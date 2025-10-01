import { Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ChatsList} from '../chats-list/chats-list';
import {ChatsService} from '@tt/data-access';

@Component({
  selector: 'app-chats',
  imports: [
    RouterOutlet,
    ChatsList
  ],
  templateUrl: './chats.html',
  styleUrl: './chats.scss'
})
export class ChatsPageComponent implements OnInit {
  _chatService = inject(ChatsService);

  ngOnInit() {
    this._chatService.connectWS();
  }
}
