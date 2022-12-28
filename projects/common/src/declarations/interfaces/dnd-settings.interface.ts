import { DndDropData, DndItemTemplateContext, DndMoveData } from '@bimeister/pupakit.overlays/src';
import { TemplateRef } from '@angular/core';
import { DndCanBeMovedFunc } from '@bimeister/pupakit.overlays/src/declarations/types/dnd-can-be-moved-func.type';
import { DndCanBeDroppableForFunc } from '@bimeister/pupakit.overlays/src/declarations/types/dnd-can-be-droppable-for-func.type';

export interface DndSettings<T> {
  dndCloneItemTemplate: TemplateRef<DndItemTemplateContext<T>> | null;
  dndCloneItemsOffset: number;
  dndOnMove: (dndMoveData: DndMoveData) => void;
  dndOnDrop: (dndDropData: DndDropData) => void;
  dndItemCanBeMoved: DndCanBeMovedFunc<T>;
  dndItemCanBeDroppableFor: DndCanBeDroppableForFunc<T>;
}
