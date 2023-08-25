import { Directive, Input, TemplateRef } from '@angular/core';

import { ActionContext } from '../../../declarations/interfaces/action-context.interface';

@Directive({
  selector: '[pupaActionMoreTriggerTemplate]',
})
export class PupaActionMoreTriggerTemplateDirective<T> {
  @Input() public pupaActionMoreTriggerTemplateTypeFrom: T;

  constructor(public readonly templateRef: TemplateRef<ActionContext<T>>) {}
}
