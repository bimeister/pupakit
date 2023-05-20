import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[pupaDndCloneItemTemplate]',
})
export class DndCloneItemTemplateDirective {
  constructor(public readonly templateRef: TemplateRef<unknown>) {}
}
