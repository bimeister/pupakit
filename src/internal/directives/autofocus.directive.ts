import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[pupaAutofocus]'
})
export class PupaAutofocusDirective implements AfterViewInit {
  constructor(private readonly elementRef: ElementRef) {}

  public ngAfterViewInit(): void {
    this.processFocus();
  }

  private processFocus(): void {
    Promise.resolve().then(() => this.elementRef.nativeElement.focus());
  }
}
