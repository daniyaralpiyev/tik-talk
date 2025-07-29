import {Component, inject, input, OnInit, signal} from '@angular/core';
import {PostComment, Post} from '../../../data/interfaces/post.interface';
import {AvatarCircle} from '../../../common-ui/avatar-circle/avatar-circle';
import {SvgIcon} from '../../../common-ui/svg-icon/svg-icon';
import {PostInput} from '../post-input/post-input';
import {CommentComponent} from './comment/comment';
import {PostService} from '../../../data/services/post.service';
import {firstValueFrom} from 'rxjs';
import {CustomRelativeDatePipe} from '../../../helpers/pipes/date-text-ago-pipe';
import {CustomDirectives} from '../../../common-ui/directives/custom-directives';

@Component({
  selector: 'app-post',
  imports: [
    AvatarCircle,
    SvgIcon,
    PostInput,
    CommentComponent,
    CustomRelativeDatePipe,
  ],
  templateUrl: './post.html',
  styleUrl: './post.scss'
})
export class PostComponent implements OnInit {
  post = input<Post>();

  comments = signal<PostComment[]>([])

  postService = inject(PostService);

  async ngOnInit() {
    this.comments.set(this.post()!.comments)
  }

  async onCreated() {
    const comments = await firstValueFrom(
      this.postService.getCommentsByPostId(this.post()!.id)
    )

    this.comments.set(comments);
  }
}
