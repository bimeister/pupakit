import { TrackByFunction } from '@angular/core';

export interface TableControllerOptions<T> {
  scrollBehavior?: ScrollBehavior;
  trackBy?: TrackByFunction<T>;
  headerRowHeightPx?: number;
  bodyRowHeightPx?: number;
}
