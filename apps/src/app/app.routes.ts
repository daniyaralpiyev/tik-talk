import { Routes } from '@angular/router';
import { canActivateAuth, LoginPage} from '@tt/auth';
import {AboutMyself, ProfileEffects, profileFeature, ProfilePage, SearchPage, SettingsPage} from '@tt/profile';
import {chatsRoutes} from '@tt/chats';
import {Layout} from '@tt/layout';
import {provideState} from '@ngrx/store';
import {
	CustomRxjsOperators,
	Experimental,
	FormsExperimental,
	SubjectRxjs,
	TestRxjs,
} from '@tt/tests';
import { provideEffects } from '@ngrx/effects';
import { Communities } from '@tt/communities';

export const routes: Routes = [
	{
		path: '',
		component: Layout,
		children: [
			{
				path: '',
				redirectTo: 'profile/me', // redirectTo: означает по пустому редиректимся в 'profile/me'
				pathMatch: 'full' // pathMatch: означает полное соответствие, 'full' - означает соответствие
			},
			{ path: 'profile/:id', component: ProfilePage },
			{ path: 'settings', component: SettingsPage },
			{
				path: 'search',
				component: SearchPage,
        providers: [
          // profileStore, провайдим NGRX Signal Store из profile.store.ts
          provideState(profileFeature), // провайдим selector profileFeature
          provideEffects(ProfileEffects) // провайдим effects ProfileEffects
        ]
      },
			{
				path: 'chats',
				loadChildren: () => chatsRoutes,
			}
		],
		canActivate: [canActivateAuth],
	},
	{ path: 'login', component: LoginPage },
	{ path: 'testRxjs', component: TestRxjs },
	{ path: 'subjectRxjs', component: SubjectRxjs },
	{ path: 'customRxjsOperators', component: CustomRxjsOperators },
	{ path: 'forms-experimental', component: FormsExperimental },
	{ path: 'experimental', component: Experimental },
	{ path: 'about-myself', component: AboutMyself }
];
