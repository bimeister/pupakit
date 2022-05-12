import { TrackByFunction } from '@angular/core';
import { TableFeatureConstructor } from '../types/table-feature-constructor.type';

export interface TableControllerOptions<T> {
  scrollBehavior?: ScrollBehavior;
  trackBy?: TrackByFunction<T>;
  headerRowHeightPx?: number;
  bodyRowHeightPx?: number;
  features?: TableFeatureConstructor<T>[];
}
