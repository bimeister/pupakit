import { TrackByFunction } from '@angular/core';
import { TableFeatureConstructor } from '../types/table-feature-constructor.type';
import { DndSettings } from '@bimeister/pupakit.dnd';

export interface TableControllerOptions<T> {
  trackBy: TrackByFunction<T | null>;
  scrollBehavior?: ScrollBehavior;
  headerRowHeightRem?: number;
  bodyRowHeightRem?: number;
  dndRowsSettings?: DndSettings<T>;
  features?: TableFeatureConstructor<T>[];
}
