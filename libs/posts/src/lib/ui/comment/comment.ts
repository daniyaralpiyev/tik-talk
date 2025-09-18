import {Component, input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {AvatarCircle} from '@tt/common-ui';
import {PostComment} from '@tt/data-access';

@Component({
  selector: 'app-comment',
  imports: [
    AvatarCircle,
    DatePipe
  ],
  templateUrl: './comment.html',
  styleUrl: './comment.scss'
})
export class CommentComponent {
  comment = input<PostComment>()
}
