import { Directive, Input, TemplateRef } from '@angular/core';
import { ContentTemplateNameDirective } from '../../../../internal/declarations/interfaces/content-template-name.interface';

@Directive({
  selector: '[pupaStepperItemContentTemplate]',
})
export class StepperItemContentDirective<T> implements ContentTemplateNameDirective<T> {
  @Input() public pupaStepperItemContentTemplate: T;

  constructor(public readonly templateRef: TemplateRef<unknown>) {}

  public getTemplateName(): T {
    return this.pupaStepperItemContentTemplate;
  }
}
