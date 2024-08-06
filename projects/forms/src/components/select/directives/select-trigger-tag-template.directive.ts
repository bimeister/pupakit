import { Directive, Input, TemplateRef } from '@angular/core';
import { SelectTriggerTagContext } from '../../../declarations/interfaces/select-trigger-tag-context.interface';

@Directive({
  selector: '[pupaSelectTriggerTagTemplate]',
})
export class PupaSelectTriggerTagTemplateDirective<T> {
  @Input() public pupaSelectTriggerTagTemplateTypeFrom: T;

  constructor(public readonly templateRef: TemplateRef<SelectTriggerTagContext<T>>) {}

  public static ngTemplateContextGuard<T>(
    _directive: PupaSelectTriggerTagTemplateDirective<T>,
    _context: unknown
  ): _context is SelectTriggerTagContext<T> {
    return true;
  }
}
