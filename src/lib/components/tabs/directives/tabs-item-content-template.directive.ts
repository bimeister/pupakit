import { Directive, Input, TemplateRef } from '@angular/core';
import { ContentTemplateNameDirective } from '../../../../internal/declarations/interfaces/content-template-name.interface';

@Directive({
  selector: '[pupaTabsItemContentTemplate]',
})
export class TabsItemContentTemplateDirective implements ContentTemplateNameDirective {
  @Input() public pupaTabsItemContentTemplate: string = '';

  constructor(public readonly templateRef: TemplateRef<unknown>) {}

  public getTemplateName(): string {
    return this.pupaTabsItemContentTemplate;
  }
}
