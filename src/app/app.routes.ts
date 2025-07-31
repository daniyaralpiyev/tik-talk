import {Routes} from '@angular/router';
import {LoginPage} from './pages/login-page/login-page';
import {SearchPage} from './pages/search-page/search-page';
import {ProfilePage} from './pages/profile-page/profile-page';
import {Layout} from './common-ui/layout/layout';
import {canActivateAuth} from './auth/access.guard';
import {SettingsPage} from './pages/settings-page/settings-page';
import {UsersMain} from './pages/users-main/users-main';
import {Parent} from './test/parent/parent';
import {ChatsPageComponent} from './pages/chats-page/chats';
import {chatsRoutes} from './pages/chats-page/chatsRoutes';

export const routes: Routes = [
  {
    path: '', component: Layout, children: [
      // redirectTo: означает по пустому редиректимся в 'profile/me'
      // pathMatch: означает полное соответствие, 'full' - означает соответствие
      {path: '', redirectTo: 'profile/me', pathMatch: 'full'},
      {path: 'profile/:id', component: ProfilePage},
      {path: 'settings', component: SettingsPage},
      {path: 'search', component: SearchPage},
      {
        path: 'chats',
        loadChildren: () => chatsRoutes
      },
      {path: 'users', component: UsersMain}, // Мой роутинг который я сделал
    ],
    canActivate: [canActivateAuth]
  },
  {path: 'login', component: LoginPage},
  {path:'parent', component: Parent}
];
