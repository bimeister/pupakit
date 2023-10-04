import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[pupaRadioImage]',
})
export class RadioImageDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
