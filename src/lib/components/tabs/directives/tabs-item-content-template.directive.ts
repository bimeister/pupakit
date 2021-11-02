import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[pupaTabsItemContentTemplate]'
})
export class TabsItemContentTemplateDirective {
  @Input() public pupaTabsItemContentTemplate: string = '';

  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
