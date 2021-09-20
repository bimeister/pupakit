import { TrackByFunction } from '@angular/core';

export interface TableControllerOptions<T> {
  scrollBehavior?: ScrollBehavior;
  trackBy?: TrackByFunction<T>;
  rowHeightPx?: number;
}
