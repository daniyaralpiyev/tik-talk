import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { SearchPage } from './pages/search-page/search-page';
import { ProfilePage } from './pages/profile-page/profile-page';
import { Layout } from './common-ui/layout/layout';
import { canActivateAuth } from '@tt/auth';
import { SettingsPage } from './pages/settings-page/settings-page';
import { chatsRoutes } from './pages/chats-page/chatsRoutes';
import { FormsExperimental } from './lib/forms-experimental/forms-experimental';
import { Experimental } from './lib/experimental/experimental';
import {AboutMyself} from './pages/settings-page/about-myself/about-myself';

export const routes: Routes = [
	{
		path: '',
		component: Layout,
		children: [
			// redirectTo: означает по пустому редиректимся в 'profile/me'
			// pathMatch: означает полное соответствие, 'full' - означает соответствие
			{ path: '', redirectTo: 'profile/me', pathMatch: 'full' },
			{ path: 'profile/:id', component: ProfilePage },
			{ path: 'settings', component: SettingsPage },
			{ path: 'search', component: SearchPage },
      { path: 'forms-experimental', component: FormsExperimental },
      { path: 'experimental', component: Experimental },
      { path: 'about-myself', component: AboutMyself },
			{
				path: 'chats',
				loadChildren: () => chatsRoutes,
			},
		],
		canActivate: [canActivateAuth],
	},
	{ path: 'login', component: LoginPage },
];
