import { TemplateRef } from '@angular/core';
import { DndItemTemplateContext } from './dnd-item-template-context.interface';
import { DndMoveData } from './dnd-move-data.interface';
import { DndDropData } from './dnd-drop-data.interface';
import { DndCanBeMovedFunc } from '../types/dnd-can-be-moved-func.type';
import { DndCanBeDroppableForFunc } from '../types/dnd-can-be-droppable-for-func.type';

export interface DndSettings<T> {
  dndCloneItemTemplate: TemplateRef<DndItemTemplateContext<T>> | null;
  dndCloneItemsOffset: number;
  dndOnMove: (dndMoveData: DndMoveData) => void;
  dndOnDrop: (dndDropData: DndDropData) => void;
  dndItemCanBeMoved: DndCanBeMovedFunc<T>;
  dndItemCanBeDroppableFor: DndCanBeDroppableForFunc<T>;
}
