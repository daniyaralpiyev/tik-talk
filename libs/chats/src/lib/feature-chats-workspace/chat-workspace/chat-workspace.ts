import {Component, inject} from '@angular/core';
import {ChatWorkspaceHeader} from './chat-workspace-header/chat-workspace-header';
import {ChatWorkspaceMessagesWrapper} from './chat-workspace-messages-wrapper/chat-workspace-messages-wrapper';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, switchMap} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {ChatsService} from '../../data/services/chats.service';
import {of} from 'rxjs';

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
  router = inject(Router)
  chatService = inject(ChatsService)

  activateChat$ = this.route.params
    .pipe(
      switchMap(({id}) => {
        if (id === 'new') {
          return this.route.queryParams.pipe(
            filter(({userId}) => userId),
            switchMap(({userId}) => {
              return this.chatService.createChat(userId).pipe(
                switchMap(chat => {
                  this.router.navigate(['chats', chat.id])
                  return of(null)
                })
              )
              }
            )
          )
        }
        return this.chatService.getChatById(id)
      })
    )
}
