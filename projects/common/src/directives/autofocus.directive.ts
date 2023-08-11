import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[pupaAutofocus]',
})
export class PupaAutofocusDirective implements AfterViewInit {
  @Input() public pupaAutofocus: boolean | '' = true;

  constructor(private readonly elementRef: ElementRef) {}

  public ngAfterViewInit(): void {
    if (this.pupaAutofocus !== false) {
      this.processFocus();
    }
  }

  private processFocus(): void {
    Promise.resolve().then(() => this.elementRef.nativeElement.focus());
  }
}
