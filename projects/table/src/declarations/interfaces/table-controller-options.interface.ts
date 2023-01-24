import { TrackByFunction } from '@angular/core';
import { TableFeatureConstructor } from '../types/table-feature-constructor.type';
import { DndSettings } from '@bimeister/pupakit.dnd';

export interface TableControllerOptions<T> {
  scrollBehavior?: ScrollBehavior;
  trackBy?: TrackByFunction<T>;
  headerRowHeightPx?: number;
  bodyRowHeightPx?: number;
  dndRowsSettings?: DndSettings<T>;
  features?: TableFeatureConstructor<T>[];
}
