import { Directive, Input, TemplateRef } from '@angular/core';
import { ContentTemplateNameDirective } from '../../../declarations/interfaces/content-template-name.interface';

@Directive({
  selector: '[pupaButtonGroupItemContentTemplate]',
})
export class ButtonGroupItemContentTemplateDirective<T> implements ContentTemplateNameDirective<T> {
  @Input() public pupaButtonGroupItemContentTemplate: T;

  constructor(public readonly templateRef: TemplateRef<unknown>) {}

  public getTemplateName(): T {
    return this.pupaButtonGroupItemContentTemplate;
  }
}
