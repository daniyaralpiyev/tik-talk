import { Component } from '@angular/core';
import {SvgIcon} from '../svg-icon/svg-icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SvgIcon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  menuItems = [
    {
      id: 1,
      label: 'Моя Страница',
      icon: 'home',
      link: ''
    },
    {
      id: 2,
      label: 'Чаты',
      icon: 'chat',
      link: 'chat'
    },
    {
      id: 3,
      label: 'Поиск',
      icon: 'search',
      link: 'search'
    },

  ]
}
