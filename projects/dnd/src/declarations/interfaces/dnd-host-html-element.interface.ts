import { DndHostDataset } from './dnd-host-dataset.interface';

export interface DndHostHtmlElement extends HTMLElement {
  readonly dataset: DndHostDataset;
}
