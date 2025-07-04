import { Component } from '@angular/core';
import {UsersPage} from '../users-page/users-page';

@Component({
  selector: 'app-users-main',
  imports: [
    UsersPage
  ],
  templateUrl: './users-main.html',
  styleUrl: './users-main.scss'
})
export class UsersMain {

}
