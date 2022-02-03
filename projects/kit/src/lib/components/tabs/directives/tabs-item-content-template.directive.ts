import { Directive, Input, TemplateRef } from '@angular/core';
import { ContentTemplateNameDirective } from '../../../../internal/declarations/interfaces/content-template-name.interface';

@Directive({
  selector: '[pupaTabsItemContentTemplate]',
})
export class TabsItemContentTemplateDirective<T> implements ContentTemplateNameDirective<T> {
  @Input() public pupaTabsItemContentTemplate: T;

  constructor(public readonly templateRef: TemplateRef<unknown>) {}

  public getTemplateName(): T {
    return this.pupaTabsItemContentTemplate;
  }
}
