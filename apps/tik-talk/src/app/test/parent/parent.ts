import { Component } from '@angular/core';
import {Child} from '../child/child';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-parent',
  imports: [Child, ReactiveFormsModule],
  templateUrl: './parent.html',
  styleUrl: './parent.scss'
})
export class Parent {
  sendParent(event: Event) {
    console.log('parent EVENT!', event);
  }

  // formParent = new FormControl('')
  //
  // send3() {
  //   console.log('parent send3', this.formParent.value);
  // }
}
