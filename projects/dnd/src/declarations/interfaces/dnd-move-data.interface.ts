import { DndItem } from './dnd-item.interface';
import { DndDropPosition } from '../types/dnd-drop-position.type';

export interface DndMoveData<Source = unknown, Target = unknown> {
  dndSourceHostId: string;
  dndSourceItems: DndItem<Source>[];
  dndTargetItem: DndItem<Target> | null;
  dndDropPosition: DndDropPosition | null;
  dndIndicatorCoords: number | null;
  currentHostIsSource: boolean;
  currentHostIsTarget: boolean;
  dndCloneCoords: [number, number];
}
