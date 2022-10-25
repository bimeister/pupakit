import { TemplateRef } from '@angular/core';
import { TableBodyCellContext } from './table-body-cell-context.interface';
import { TableHeaderCellContext } from './table-header-cell-context.interface';

export interface TableTemplatesRegistry<T> {
  getHeaderCellTemplateByType(columnType: string): TemplateRef<TableHeaderCellContext>;
  getBodyCellTemplateByType(columnType: string): TemplateRef<TableBodyCellContext<T>>;
}
