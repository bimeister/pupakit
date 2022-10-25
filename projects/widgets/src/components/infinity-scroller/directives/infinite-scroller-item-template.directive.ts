import { Directive, Input, TemplateRef } from '@angular/core';
import { InfinityScrollerItemContext } from '../../../declarations/interfaces/infinity-scroller-item-context.interface';

@Directive({
  selector: '[pupaInfiniteScrollerItemTemplate]',
})
export class InfiniteScrollerItemTemplateDirective<T> {
  @Input() public pupaInfiniteScrollerItemTemplateTypeFrom: T;

  constructor(public readonly templateRef: TemplateRef<InfinityScrollerItemContext<T>>) {}
}
