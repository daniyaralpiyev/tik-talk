import {Post} from '@tt/data-access';
import {createFeature, createReducer, on} from '@ngrx/store';
import {postsActions} from './actions';

// Сначала создаем интерфейс стора
export interface PostsState {
  posts: Post[]
  searchTerm: string // обязательное поле, чтобы был селектор selectSearchTerm
}

// Задаем начальные значения
export const initialState: PostsState = {
  posts: [], // posts будет хранить весь результат из метода on
  searchTerm: ''
}

// Теперь создаем сам редьюсер
export const postsFeature = createFeature({
  name: 'postsFeature',
  reducer: createReducer(
    initialState, // в метод on передаем экшн, который "слушает" редьюсер, начальное значение и то, что будем класть в стейт
    on(postsActions.postsLoaded, (state, payload) => { // стейт полностью обновляется на новый объект, кладем старое значение стейта и наши посты
      return {
        ...state,
        posts: payload.posts
      }
    })
  )
})
