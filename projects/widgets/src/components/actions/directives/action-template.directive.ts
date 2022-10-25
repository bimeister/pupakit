import { Directive, Input, TemplateRef } from '@angular/core';

import { ActionContext } from '../../../declarations/interfaces/action-context.interface';

@Directive({
  selector: '[pupaActionTemplate]',
})
export class PupaActionTemplateDirective<T> {
  @Input() public pupaActionTemplate: T;

  constructor(public readonly templateRef: TemplateRef<ActionContext<T>>) {}
}
