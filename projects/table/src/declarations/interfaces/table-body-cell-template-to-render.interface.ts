import { TemplateRef } from '@angular/core';
import { TableBodyCellContext } from './table-body-cell-context.interface';

export interface TableBodyCellTemplateToRender<T> {
  templateRef: TemplateRef<TableBodyCellContext<T>>;
  context: TableBodyCellContext<T>;
}
