import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'svg[icon]', // все svg у которых будут указываться атрибут icon станут этим компонентом
  standalone: true,
  imports: [],
  template: '<svg><use [attr.href]="href"></use></svg>',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgIcon {
  @Input() icon = '';
  get href() {
    // через # обращаемся к нужному id-щнику иконки
    return `/assets/svg/${this.icon}.svg#${this.icon}`;
  }
}
