import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[pupaSearchFieldActionsRight]',
})
export class SearchFieldActionsRightDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
