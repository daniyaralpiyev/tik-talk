import {Component, Input} from '@angular/core';
import {ImgUrlPipe} from '@tt/common-ui';
import {Profile} from '@tt/data-access';

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
