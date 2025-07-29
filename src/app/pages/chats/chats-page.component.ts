import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ChatsList} from './chats-list/chats-list';

@Component({
  selector: 'app-chats',
  imports: [
    RouterOutlet,
    ChatsList
  ],
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.scss'
})
export class ChatsPage {

}
