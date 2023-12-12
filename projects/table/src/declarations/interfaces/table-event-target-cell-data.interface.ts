import { TableRowType } from '../enums/table-row-type.enum';

export interface TableEventTargetCellData {
  index: number;
  columnId: string;
  rowId: string;
  rowType: TableRowType;
  element: HTMLElement;
  srcEvent: Event;
}
