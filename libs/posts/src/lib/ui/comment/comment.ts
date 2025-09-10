import {Component, input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {PostComment} from '../../data';
import {AvatarCircle} from '@tt/common-ui';

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
