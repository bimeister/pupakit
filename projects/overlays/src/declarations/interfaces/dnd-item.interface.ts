import { DndItemHtmlElement } from './dnd-item-html-element.interface';

export interface DndItem<T = unknown> {
  id: string;
  data: T;
  elementParts: DndItemHtmlElement[];
}
