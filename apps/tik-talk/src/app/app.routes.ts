import { Routes } from '@angular/router';
import { canActivateAuth, LoginPage} from '@tt/auth';
import { FormsExperimental } from './lib/forms-experimental/forms-experimental';
import { Experimental } from './lib/experimental/experimental';
import {AboutMyself, ProfilePage, SearchPage, SettingsPage} from '@tt/profile';
import {chatsRoutes} from '@tt/chats';
import {Layout} from '@tt/layout';
import {provideState} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {ProfileEffects, profileFeature} from '../../../../libs/profile/src/lib/data';

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
			{
        path: 'search',
        component: SearchPage,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects)
        ]
      },
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
