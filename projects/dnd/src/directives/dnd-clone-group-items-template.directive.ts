import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[pupaDndCloneGroupItemsTemplate]',
})
export class DndCloneGroupItemsTemplateDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
