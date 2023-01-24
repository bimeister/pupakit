import { DndItem } from '../interfaces/dnd-item.interface';

export type DndCanBeMovedFunc<T> = (currentDndItem: DndItem<T>) => boolean;
