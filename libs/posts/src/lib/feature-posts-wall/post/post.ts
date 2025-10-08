import {ChangeDetectionStrategy, Component, inject, input, OnInit, signal} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {AvatarCircle, CustomRelativeDatePipe, SvgIcon} from '@tt/common-ui';
import {CommentComponent, PostInput} from '../../ui';
import {Post, PostComment, PostService, ProfileService} from '@tt/data-access';

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
  styleUrl: './post.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
