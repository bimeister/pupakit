import { TableCellHtmlElement } from '../declarations/interfaces/table-cell-html-element.interface';

export function isTableCellHtmlElement(value: unknown): value is TableCellHtmlElement {
  if (!(value instanceof HTMLElement)) {
    return false;
  }

  const element: TableCellHtmlElement = value as TableCellHtmlElement;
  return element.dataset.columnId !== undefined && element.dataset.rowId !== undefined;
}
