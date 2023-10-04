import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[pupaRadioIcon]',
})
export class RadioIconDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
