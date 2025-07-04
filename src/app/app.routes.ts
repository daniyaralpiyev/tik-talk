import {Routes} from '@angular/router';
import {LoginPage} from './pages/login-page/login-page';
import {SearchPage} from './pages/search-page/search-page';
import {ProfilePage} from './pages/profile-page/profile-page';
import {Layout} from './common-ui/layout/layout';
import {canActivateAuth} from './auth/access.guard';
import {SettingsPage} from './pages/settings-page/settings-page';
import {UsersPage} from './pages/users-page/users-page';
import {UsersMain} from './pages/users-main/users-main';

export const routes: Routes = [
  {
    path: '', component: Layout, children: [
      {path: '', component: SearchPage},
      {path: 'profile/:id', component: ProfilePage},
      {path: 'settings', component: SettingsPage},
      {path: 'users', component: UsersMain},
    ],
    canActivate: [canActivateAuth]
  },
  {path: 'login', component: LoginPage}
];
