import {Component, input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {AvatarCircle} from '@tt/common-ui';
import {PostComment} from '../../../../../data-access/src/lib/data/interfaces/post.interface';

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
