import {Component, EventEmitter, HostBinding, inject, input, Output, Renderer2} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AvatarCircle, SvgIcon} from '@tt/common-ui';
import {ProfileService} from '@tt/profile';

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
  profile = inject(ProfileService).me

  isCommentInput = input(false)
  postId = input<number>(0)
  postText = ''

  @Output() created = new EventEmitter()

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput()
  }

  onTextAreaInput(event: Event) {
    const textArea = event.target as HTMLTextAreaElement;
    this.r2.setStyle(textArea, 'height', 'auto'); // textArea становится больше либо меньше по мере заполнения
    this.r2.setStyle(textArea, 'height', textArea.scrollHeight + 'px'); // счет будет в пикселях
  }

  onSend() {
    if (this.postText.trim()) {
      this.created.emit(this.postText)
      this.postText = ''
    }
  }
}
