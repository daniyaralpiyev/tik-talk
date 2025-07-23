import {Component, ElementRef, HostListener, inject, Renderer2} from '@angular/core';
import {PostInput} from '../post-input/post-input';
import {PostService} from '../../../data/services/post.service';
import {firstValueFrom, fromEvent} from 'rxjs';
import {PostComponent} from '../post/post';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-post-feed',
  imports: [
    PostInput,
    PostComponent,
  ],
  templateUrl: './post-feed.html',
  styleUrl: './post-feed.scss'
})
export class PostFeed {
  postService = inject(PostService)
  hostElement = inject(ElementRef)
  r2 = inject(Renderer2)

  feed = this.postService.posts

  @HostListener('window:resize')
  onWindowResize() {

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
}
