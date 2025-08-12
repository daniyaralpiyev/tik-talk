import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  input,
  Output,
  Renderer2
} from '@angular/core';
import {PostInput} from '../post-input/post-input';
import {PostService} from '../../../data/services/post.service';
import {firstValueFrom, fromEvent} from 'rxjs';
import {PostComponent} from '../post/post';
import {debounceTime} from 'rxjs/operators';
import {ProfileService} from '../../../data/services/profile-service';

@Component({
  selector: 'app-post-feed',
  imports: [
    PostInput,
    PostComponent,
  ],
  templateUrl: './post-feed.html',
  styleUrl: './post-feed.scss'
})
export class PostFeed implements AfterViewInit {
  postService = inject(PostService)
  hostElement = inject(ElementRef)
  r2 = inject(Renderer2)
  profile = inject(ProfileService).me

  feed = this.postService.posts

  @Output() created = new EventEmitter()

  @HostListener('window:resize')
  onWindowResize() {
    this.resizeFeed()
  }

  constructor() {
    firstValueFrom(this.postService.fetchPosts())
  }

  ngAfterViewInit() {
    this.resizeFeed()

    fromEvent(window, 'resize')
      .pipe(
        debounceTime(1000),
      )
      .subscribe(()=> {
        console.log(123123123)
      })
  }

  resizeFeed() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect()
    const height = window.innerHeight - top - 24 - 24
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  // Создание поста
  onCreatePost(postText: string) {
    if (!postText) return

    firstValueFrom(this.postService.createPost({
      title: 'Клевый пост',
      content: postText,
      authorId: this.profile()!.id
    })).then(() => {
      postText = ''
    })
  }
}
