import { TableColumnSorting } from '../enums/table-column-sorting.enum';

export interface TableColumnSortingOptions {
  defaultState?: TableColumnSorting;
  sortable?: boolean;
  isSortingNoneAvailable?: boolean;
}
