import {inject, Injectable} from '@angular/core';
import {PostService} from '@tt/data-access';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {postsActions} from './actions';
import {map, switchMap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsEffects {
  postService = inject(PostService);
  actions$ = inject(Actions);

  fetchPost = createEffect(() => {
    return this.actions$.pipe(
      // ловит нужный экшн, переход ниже к switchMap
      ofType(postsActions.postsGet),
      switchMap(() => {
        // получаем все данные с постами из сервиса
        return this.postService.fetchPosts()
      }),
      // Берём массив постов из API и оборачиваем его в новый экшен postsLoaded,
      // возвращаемся, обратно в экшн, чтобы передать данные в редьюсер.
      map(posts => postsActions.postsLoaded({posts: posts}))
    )
  })
}
