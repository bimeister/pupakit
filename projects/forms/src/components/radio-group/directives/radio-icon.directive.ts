import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[pupaRadioIcon]',
})
export class RadioIconDirective {
  @Input() public pupaRadioIcon: boolean;

  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
