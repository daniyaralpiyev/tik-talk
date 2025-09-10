import {Component, Input} from '@angular/core';
import {Profile} from '../../../../../../../libs/profile/src/lib/data/interfaces/profile.interface';
import {ImgUrlPipe} from '../../../../../../../libs/common-ui/src/lib/pipes/img-url-pipe';

@Component({
  selector: 'app-subscriber-card',
  imports: [
    ImgUrlPipe
  ],
  templateUrl: './subscriber-card.html',
  styleUrl: './subscriber-card.scss'
})
export class SubscriberCard {
  @Input() profile!: Profile;
}
