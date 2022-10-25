import { TemplateRef } from '@angular/core';
import { TableHeaderCellContext } from './table-header-cell-context.interface';

export interface TableHeaderCellTemplateToRender {
  templateRef: TemplateRef<TableHeaderCellContext>;
  context: TableHeaderCellContext;
}
