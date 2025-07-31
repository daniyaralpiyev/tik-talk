import {Component, EventEmitter, inject, input, OnInit, Output, signal} from '@angular/core';
import {PostComment, Post} from '../../../data/interfaces/post.interface';
import {AvatarCircle} from '../../../common-ui/avatar-circle/avatar-circle';
import {SvgIcon} from '../../../common-ui/svg-icon/svg-icon';
import {PostInput} from '../post-input/post-input';
import {CommentComponent} from './comment/comment';
import {PostService} from '../../../data/services/post.service';
import {firstValueFrom} from 'rxjs';
import {CustomRelativeDatePipe} from '../../../helpers/pipes/date-text-ago-pipe';
import {ProfileService} from '../../../data/services/profile-service';

@Component({
  selector: 'app-post',
  standalone: true,
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
  postService = inject(PostService);
  profile = inject(ProfileService).me

  post = input<Post>();
  comments = signal<PostComment[]>([])

  async ngOnInit() {
    this.comments.set(this.post()!.comments)
  }

  // Создание комментария
  async onCreated(commentText: string) {

      firstValueFrom(this.postService.createComment({
        text: commentText,
        authorId: this.profile()!.id,
        postId: this.post()!.id
      }))
        .then(async() => {
        const comments = await firstValueFrom(
          this.postService.getCommentsByPostId(this.post()!.id)
        )
        this.comments.set(comments);
      })
        .catch(error => console.error(error))
      return;
  }
}
