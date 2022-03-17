import { TableRowType } from '../enums/table-row-type.enum';

export interface TableCellHtmlElementDataset extends DOMStringMap {
  columnId: string;
  rowId: string;
  index: string;
  rowType: TableRowType;
}
