import {Component, input} from '@angular/core';
import {Profile} from '../../data/interfaces/profile.interface';
import {AvatarCircle} from '../avatar-circle/avatar-circle';

@Component({
  selector: 'app-profile-header',
  imports: [
    AvatarCircle
  ],
  templateUrl: './profile-header.html',
  styleUrl: './profile-header.scss'
})
export class ProfileHeader {
  profile = input<Profile>();
}
