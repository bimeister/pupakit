import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[pupaTagActionButtonTemplate]',
})
export class TagActionButtonTemplateDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
