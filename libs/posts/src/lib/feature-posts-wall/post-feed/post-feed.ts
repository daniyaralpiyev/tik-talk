import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Output,
  Renderer2
} from '@angular/core';
import {firstValueFrom, fromEvent} from 'rxjs';
import {PostComponent} from '../post/post';
import {debounceTime} from 'rxjs/operators';
import {PostService, ProfileService} from '@tt/data-access';
import {PostInput} from '../../ui';
import {Store} from '@ngrx/store';
import {postsActions, selectedPosts} from '../../data';

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
  store = inject(Store)

  // код feed который писал Иван
  // feed = this.postService.posts

  // Код feed который писал через пример Кристины
  feed = this.store.selectSignal(selectedPosts); // данные приходят из стора

  @Output() created = new EventEmitter()

  @HostListener('window:resize')
  onWindowResize() {
    this.resizeFeed()
  }

  constructor() {
    firstValueFrom(this.postService.fetchPosts())
    this.store.dispatch(postsActions.postsGet());
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
