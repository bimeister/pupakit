import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[pupaRadioImage]',
})
export class RadioImageDirective {
  @Input() public pupaRadioImage: boolean;

  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
