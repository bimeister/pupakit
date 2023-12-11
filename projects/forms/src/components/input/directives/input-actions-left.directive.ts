import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[pupaInputActionsLeft]',
})
export class InputActionsLeftDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
