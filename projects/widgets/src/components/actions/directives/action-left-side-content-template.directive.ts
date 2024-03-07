import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[pupaActionLeftSideContentTemplate]',
})
export class PupaActionLeftSideContentTemplateDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
