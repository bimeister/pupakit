import { Uuid } from '../types/uuid.type';

export interface GridRowEvent {
  eventName: keyof WindowEventMap;
  targetRowId: Uuid;
}
