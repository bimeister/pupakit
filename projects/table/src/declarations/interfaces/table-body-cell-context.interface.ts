import { TableBodyBaseRowRef } from './table-body-row-ref.interface';
import { TableColumnRef } from './table-column-ref.interface';

export interface TableBodyCellContext<T> {
  $implicit: TableBodyBaseRowRef<T>;
  column: TableColumnRef;
}
