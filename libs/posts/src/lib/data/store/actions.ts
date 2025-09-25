import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Post} from '@tt/data-access';

export const postsActions = createActionGroup( {
  source: 'posts',
  events: {
    'posts get': emptyProps(), // Создали экшн, который делает запрос на бэк
    'posts loaded': props<{posts: Post[]}>(), // Создали экшн, который позволяет загружать данные в стор
  }
})
