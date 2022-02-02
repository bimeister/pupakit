import { Directive, Input, TemplateRef } from '@angular/core';
import { PageTabNames } from '../declarations/types/page-tab-names.type';

@Directive({
  selector: '[demoPageTab]',
})
export class PageTabDirective {
  @Input() public demoPageTab: PageTabNames;

  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
