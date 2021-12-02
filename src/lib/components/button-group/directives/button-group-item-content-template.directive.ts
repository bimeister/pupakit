import { Directive, Input, TemplateRef } from '@angular/core';
import { ContentTemplateNameDirective } from '../../../../internal/declarations/interfaces/content-template-name.interface';

@Directive({
  selector: '[pupaButtonGroupItemContentTemplate]',
})
export class ButtonGroupItemContentTemplateDirective implements ContentTemplateNameDirective {
  @Input() public pupaButtonGroupItemContentTemplate: string = '';

  constructor(public readonly templateRef: TemplateRef<unknown>) {}

  public getTemplateName(): string {
    return this.pupaButtonGroupItemContentTemplate;
  }
}
