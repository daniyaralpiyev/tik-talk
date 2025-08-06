import {Component, input} from '@angular/core';
import {Profile} from '../../../../data/interfaces/profile.interface';
import {AvatarCircle} from '../../../../common-ui/avatar-circle/avatar-circle';

@Component({
  selector: 'app-chat-workspace-header',
  imports: [
    AvatarCircle
  ],
  templateUrl: './chat-workspace-header.html',
  styleUrl: './chat-workspace-header.scss'
})
export class ChatWorkspaceHeader {
  profile = input.required<Profile>()
}
