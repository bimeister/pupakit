import { DndItem } from './dnd-item.interface';
import { DndCanBeMovedFunc } from '../types/dnd-can-be-moved-func.type';
import { DndCanBeDroppableForFunc } from '../types/dnd-can-be-droppable-for-func.type';

export interface DndItemConfig<T = unknown> {
  dndItem: DndItem<T>;
  canBeMoved: DndCanBeMovedFunc<T>;
  canBeDroppableFor: DndCanBeDroppableForFunc<T>;
  dndStartTrigger?: HTMLElement;
}
