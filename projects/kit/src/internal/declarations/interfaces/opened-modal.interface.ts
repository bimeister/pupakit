import { Observable } from 'rxjs';

import { Position } from '../types/position.type';

export interface OpenedModal<ReturnDataT = null> {
  id: string;
  closed$: Observable<ReturnDataT>;
  positionUpdated$: Observable<Position>;
  isFullscreen$: Observable<boolean>;
}
