import { DndItem } from './dnd-item.interface';
import { DndDropPosition } from '../types/dnd-drop-position.type';

export interface DndDropData {
  dndSourceItems: DndItem[];
  dndTargetItem: DndItem | null;
  dndDropPosition: DndDropPosition | null;
  currentHostIsSource: boolean;
  currentHostIsTarget: boolean;
}
