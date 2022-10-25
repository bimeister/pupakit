import { Position } from '@bimeister/pupakit.common';
import { Observable } from 'rxjs';

export interface OpenedModal<ReturnDataT = null> {
  id: string;
  closed$: Observable<ReturnDataT>;
  positionUpdated$: Observable<Position>;
  isFullscreen$: Observable<boolean>;
}
