import { Directive, TemplateRef } from '@angular/core';
import { TableHeaderCellContext } from '../declarations/interfaces/table-header-cell-context.interface';

@Directive({
  selector: '[pupaTableHeaderCellTemplate]',
})
export class TableHeaderCellTemplateDirective {
  constructor(public readonly templateRef: TemplateRef<TableHeaderCellContext>) {}
}
