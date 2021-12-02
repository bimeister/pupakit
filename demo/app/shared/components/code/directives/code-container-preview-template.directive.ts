import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[pupaCodeContainerPreviewTemplate]',
})
export class CodeContainerPreviewTemplateDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
