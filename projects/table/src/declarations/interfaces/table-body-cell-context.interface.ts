import { TableBodyRowRef } from './table-body-row-ref.interface';
import { TableColumnRef } from './table-column-ref.interface';

export interface TableBodyCellContext<TCell, TColumn = unknown> {
  $implicit: TableBodyRowRef<TCell>;
  column: TableColumnRef<TColumn>;
}
