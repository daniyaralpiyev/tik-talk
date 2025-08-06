import {Component, inject} from '@angular/core';
import {ChatWorkspaceHeader} from './chat-workspace-header/chat-workspace-header';
import {ChatWorkspaceMessagesWrapper} from './chat-workspace-messages-wrapper/chat-workspace-messages-wrapper';
import {ActivatedRoute} from '@angular/router';
import {ChatsService} from '../../../data/services/chats.service';
import {switchMap} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-chat-workspace',
  imports: [
    ChatWorkspaceHeader,
    ChatWorkspaceMessagesWrapper,
    AsyncPipe
  ],
  templateUrl: './chat-workspace.html',
  styleUrl: './chat-workspace.scss'
})
export class ChatWorkspace {
  route = inject(ActivatedRoute)

  chatService = inject(ChatsService)

  activateChat$ = this.route.params
    .pipe(
      switchMap(({id}) => this.chatService.getChatById(id))
    )
}
