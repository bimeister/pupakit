import { TableBodyRowRef } from './table-body-row-ref.interface';
import { TableColumnRef } from './table-column-ref.interface';

export interface TableBodyCellContext<T> {
  $implicit: TableBodyRowRef<T>;
  column: TableColumnRef;
}
