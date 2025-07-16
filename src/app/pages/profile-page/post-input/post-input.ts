import {Component, EventEmitter, HostBinding, inject, input, Output, Renderer2} from '@angular/core';
import {AvatarCircle} from '../../../common-ui/avatar-circle/avatar-circle';
import {ProfileService} from '../../../data/services/profile-service';
import {SvgIcon} from '../../../common-ui/svg-icon/svg-icon';
import {PostService} from '../../../data/services/post.service';
import {FormsModule} from '@angular/forms';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-post-input',
  imports: [
    AvatarCircle,
    SvgIcon,
    FormsModule,
  ],
  templateUrl: './post-input.html',
  styleUrl: './post-input.scss'
})
export class PostInput {
  r2 = inject(Renderer2)
  postService = inject(PostService)

  isCommentInput = input(false)
  postId = input<number>(0)
  profile = inject(ProfileService).me

  @Output() created = new EventEmitter()

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput()
  }

  PostText = ''

  onTextAreaInput(event: Event) {
    const textArea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textArea, 'height', 'auto'); // textArea становится больше либо меньше по мере заполнения
    this.r2.setStyle(textArea, 'height', textArea.scrollHeight + 'px'); // счет будет в пикселях
  }

  onCreatePost() {
    if (!this.PostText) return

    if (this.isCommentInput()) {
      firstValueFrom(this.postService.createComment({
        text: this.PostText,
        authorId: this.profile()!.id,
        postId: this.postId()
      })).then(() => {
        this.PostText = ''
        this.created.emit()
      })
      return;
    }

    firstValueFrom(this.postService.createPost({
      title: 'Клевый пост',
      content: this.PostText,
      authorId: this.profile()!.id
    })).then(() => {
      this.PostText = ''
    })
  }
}
