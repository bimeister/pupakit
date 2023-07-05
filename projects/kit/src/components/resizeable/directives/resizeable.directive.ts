import { Directive, ElementRef, Inject } from '@angular/core';

@Directive({
  selector: '[pupaResizeable]'
})
export class PupaResizeableDirective<T extends Element = HTMLElement> extends ElementRef<T> {
  public readonly nativeElement: T;

  constructor(@Inject(ElementRef) elementRef: ElementRef<T>) {
    super(elementRef.nativeElement);
  }
}
