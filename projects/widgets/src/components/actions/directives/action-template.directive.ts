import { Directive, Input, TemplateRef } from '@angular/core';

import { ActionContext } from '../../../declarations/interfaces/action-context.interface';

@Directive({
  selector: '[pupaActionTemplate]',
})
export class PupaActionTemplateDirective<T> {
  @Input() public pupaActionTemplateTypeFrom: T;
  @Input() public pupaActionTemplateIsDividerShown: (action: T) => boolean;

  constructor(public readonly templateRef: TemplateRef<ActionContext<T>>) {}
}
