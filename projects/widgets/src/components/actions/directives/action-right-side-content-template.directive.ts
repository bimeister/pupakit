import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[pupaActionRightSideContentTemplate]',
})
export class PupaActionRightSideContentTemplateDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
