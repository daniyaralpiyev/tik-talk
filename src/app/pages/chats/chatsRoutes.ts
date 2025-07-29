import {Route} from '@angular/router';
import {ChatsPage} from './chats-page.component';
import {ChatWorkspace} from './chat-workspace/chat-workspace';

export const chatsRoutes: Route[] = [
  {
    path: '',
    component: ChatsPage,
    children: [
      {
        path: ':id', component:ChatWorkspace
      }
    ]
  }
]
