import { TableColumnSorting } from '../enums/table-column-sorting.enum';

export interface TableSort<T extends string = string> {
  columnId: T;
  sort: TableColumnSorting;
}
