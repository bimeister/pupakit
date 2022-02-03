import { TableCellHtmlElementDataset } from './table-cell-html-element-dataset.interface';

export interface TableCellHtmlElement extends HTMLElement {
  readonly dataset: TableCellHtmlElementDataset;
}
