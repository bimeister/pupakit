import { Directive, Input, TemplateRef } from '@angular/core';
import { TableBodyCellContext } from '../declarations/interfaces/table-body-cell-context.interface';

@Directive({
  selector: '[pupaTableBodyCellTemplate]',
})
export class TableBodyCellTemplateDirective<TCell, TColumn> {
  @Input() public pupaTableBodyCellTemplateCellTypeFrom: TCell;
  @Input() public pupaTableBodyCellTemplateColumnTypeFrom: TColumn;

  constructor(public readonly templateRef: TemplateRef<TableBodyCellContext<TCell, TColumn>>) {}

  public static ngTemplateContextGuard<TCell, TColumn>(
    _directive: TableBodyCellTemplateDirective<TCell, TColumn>,
    _context: unknown
  ): _context is TableBodyCellContext<TCell, TColumn> {
    return true;
  }
}
