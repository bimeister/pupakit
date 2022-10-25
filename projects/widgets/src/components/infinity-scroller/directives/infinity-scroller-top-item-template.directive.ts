import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[pupaInfiniteScrollerTopItemTemplate]',
})
export class InfiniteScrollerTopItemTemplateDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
