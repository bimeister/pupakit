import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[pupaAccordionActionTemplate]',
})
export class PupaAccordionActionTemplateDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
