import {ChangeDetectionStrategy, Component, EventEmitter, inject, Output, Renderer2} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AvatarCircle, SvgIcon} from '@tt/common-ui';
import {ProfileService} from '@tt/data-access';

@Component({
  selector: 'app-message-input',
  imports: [
    FormsModule,
    AvatarCircle,
    SvgIcon
  ],
  templateUrl: './message-input.html',
  styleUrl: './message-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageInput {
  r2 = inject(Renderer2)
  me = inject(ProfileService).me

  @Output() created = new EventEmitter<string>()

  postText = ''

  onTextAreaInput(event: Event) {
    const textArea = event.target as HTMLTextAreaElement;
    this.r2.setStyle(textArea, 'height', 'auto'); // textArea становится больше либо меньше по мере заполнения
    this.r2.setStyle(textArea, 'height', textArea.scrollHeight + 'px'); // счет будет в пикселях
  }

  onCreatePost() {
    if (!this.postText) return
    this.created.emit(this.postText)
    this.postText = ''
  }
}
