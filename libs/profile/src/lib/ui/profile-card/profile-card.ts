import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { ImgUrlPipe, SvgIcon } from '@tt/common-ui';
import {Profile} from '@tt/data-access';

@Component({
	selector: 'app-profile-card',
	standalone: true,
	imports: [ImgUrlPipe, SvgIcon],
	templateUrl: './profile-card.html',
	styleUrl: './profile-card.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCard {
	// Это способ приема данных от родительского компонента.
	@Input() profile!: Profile;
	// @Input - Декоратор помечающий свойство как входное (данные приходят извне).
	// ! (восклицательный знак) - говорит "Это свойство точно будет проинициализировано, даже если сейчас его нет".
}
