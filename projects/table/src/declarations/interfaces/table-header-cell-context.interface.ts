import { TableColumnRef } from './table-column-ref.interface';

export interface TableHeaderCellContext<TColumn = unknown> {
  $implicit: TableColumnRef<TColumn>;
  isDndClone: boolean;
}
