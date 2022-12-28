import { DndItem } from './dnd-item.interface';
import { DndDropPosition } from '../types/dnd-drop-position.type';

export interface DndMoveData {
  dndSourceItems: DndItem[];
  dndTargetItem: DndItem | null;
  dndDropPosition: DndDropPosition | null;
  dndIndicatorCoords: number | null;
  currentHostIsSource: boolean;
  currentHostIsTarget: boolean;
  dndCloneCoords: [number, number];
}
