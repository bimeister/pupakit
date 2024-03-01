import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[pupaScrollableContent]',
})
export class ScrollableContentDirective {
  constructor(private readonly elementRef: ElementRef<HTMLElement>, private readonly renderer: Renderer2) {
    this.renderer.addClass(this.elementRef.nativeElement, 'pupa-invisible-scrollbars');
  }
}
