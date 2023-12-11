import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[pupaInputActionsRight]',
})
export class InputActionsRightDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
