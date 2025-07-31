import {Component, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ChatsBtn} from '../chats-btn/chats-btn';
import {ChatsService} from '../../../data/services/chats.service';
import {AsyncPipe} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {map, switchMap} from 'rxjs';
import {startWith} from 'rxjs/operators';

@Component({
  selector: 'app-chats-list',
  imports: [
    ReactiveFormsModule,
    ChatsBtn,
    AsyncPipe,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './chats-list.html',
  styleUrl: './chats-list.scss'
})
export class ChatsList {
  chatsService = inject(ChatsService);

  filterChatsControl = new FormControl();

  // В поле Искать... при вводе ищет по имени и фамилий
  chats$ = this.chatsService.getMyChats() // запрос на бэк и получили какое то кол-во чатов
    .pipe(
      switchMap(chats => { // изменили стрим
        return this.filterChatsControl.valueChanges // подписались на изменение контрола
          .pipe(
            startWith(''),
            // теперь когда контрол меняется можем оперировать chats и значением который дал контрол в inputValue
            map(inputValue => {
              // меняем итоговое значение стрима на отфильтрованные чаты
              return chats.filter(chat => {
                return `${chat.userFrom.firstName} ${chat.userFrom.lastName}`
                  .toLowerCase().includes(inputValue.toLowerCase());
              })
            })
          )
      })
    )
}
