import { Directive, Input, TemplateRef } from '@angular/core';

import { ActionContext } from '../../../../internal/declarations/interfaces/action-context.interface';

@Directive({
  selector: '[pupaActionDropdownTemplate]',
})
export class PupaActionDropdownTemplateDirective<T> {
  @Input() public pupaActionDropdownTemplate: T;

  constructor(public readonly templateRef: TemplateRef<ActionContext<T>>) {}
}
