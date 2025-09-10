import {Route} from '@angular/router';
import {ChatsPageComponent} from './chats';
import {ChatWorkspace} from './chat-workspace/chat-workspace';

export const chatsRoutes: Route[] = [
  {
    path: '',
    component: ChatsPageComponent,
    children: [
      {
        path: ':id',
        component: ChatWorkspace
      },
    ]
  }
]
