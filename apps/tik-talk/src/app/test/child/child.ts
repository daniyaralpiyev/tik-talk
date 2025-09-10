import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-child',
  imports: [ReactiveFormsModule],
  templateUrl: './child.html',
  styleUrl: './child.scss'
})
export class Child {
  @Output() child = new EventEmitter();

  form = new FormControl('')

  sendChild() {
    this.child.emit(this.form.value);
  }
}
