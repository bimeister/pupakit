import { TrackByFunction } from '@angular/core';

export interface ControllerOptions<T> {
  scrollBehavior?: ScrollBehavior;
  trackBy?: TrackByFunction<T>;
}
