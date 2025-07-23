import {Directive, HostBinding, HostListener} from '@angular/core';

@Directive({
  selector: '[customDirectives]'
})
export class CustomDirectives {

  @HostBinding('style.color') color = 'lime';
  @HostBinding('style.background') bgColor = 'transparent';

  @HostListener('mouseenter') handleMouseEnter() {
    this.bgColor = 'orange';
  }

  @HostListener('mouseleave') handleMouseLeave() {
    this.bgColor = 'transparent';
  }
}
