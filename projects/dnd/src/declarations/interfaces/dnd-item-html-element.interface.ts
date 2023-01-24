import { DndItemDataset } from './dnd-item-dataset.interface';

export interface DndItemHtmlElement extends HTMLElement {
  readonly dataset: DndItemDataset;
}
