import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[pupaInfiniteScrollerBottomItemTemplate]',
})
export class InfiniteScrollerBottomItemTemplateDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
