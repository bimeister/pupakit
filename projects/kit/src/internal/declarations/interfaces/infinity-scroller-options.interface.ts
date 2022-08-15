import { TrackByFunction } from '@angular/core';
import { ScrollMoveDirection } from '../../declarations/enums/scroll-move-direction.enum';

export interface InfinityScrollerOptions<T> {
  scrollMoveDirection: ScrollMoveDirection;
  bufferSize?: number;
  trackBy?: TrackByFunction<T>;
}
