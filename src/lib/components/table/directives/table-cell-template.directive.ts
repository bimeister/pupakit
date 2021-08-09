import { Directive, Input, TemplateRef } from '@angular/core';
import { TableBodyCellContext } from '../../../../internal/declarations/interfaces/table-body-cell-context.interface';

@Directive({
  selector: '[pupaTableBodyCellTemplate]'
})
export class TableBodyCellTemplateDirective<T> {
  @Input() public pupaTableBodyCellTemplateTypeFrom: T;

  constructor(public readonly templateRef: TemplateRef<TableBodyCellContext<T>>) {}
}
