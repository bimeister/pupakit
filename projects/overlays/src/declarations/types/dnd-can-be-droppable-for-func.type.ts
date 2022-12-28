import { DndItem } from '../interfaces/dnd-item.interface';
import { DndDropPosition } from './dnd-drop-position.type';

export type DndCanBeDroppableForFunc<T> = (
  currentDndItem: DndItem<T>,
  dndDropItems: DndItem[],
  dndDropPosition: DndDropPosition
) => boolean;
