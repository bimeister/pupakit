import { DndItem } from './dnd-item.interface';
import { DndDropPosition } from '../types/dnd-drop-position.type';

export interface DndDropData<Source = unknown, Target = unknown> {
  dndSourceHostId: string;
  dndTargetHostId: string;
  dndSourceItems: DndItem<Source>[];
  dndTargetItem: DndItem<Target> | null;
  dndDropPosition: DndDropPosition | null;
  currentHostIsSource: boolean;
  currentHostIsTarget: boolean;
}
