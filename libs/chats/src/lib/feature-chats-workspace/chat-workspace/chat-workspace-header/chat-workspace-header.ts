import {Component, input} from '@angular/core';
import {AvatarCircle} from '@tt/common-ui';
import {Profile} from '@tt/profile';

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
