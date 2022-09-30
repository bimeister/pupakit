import { Injector, StaticProvider } from '@angular/core';

import { Position } from '../types/position.type';
import { ConnectedPositionX } from '../types/connected-position-x.type';
import { ConnectedPositionY } from '../types/connected-position-y.type';

export interface ModalConfig {
  hasBackdrop: boolean;
  closeOnBackdropClick: boolean;
  isBackdropTransparent: boolean;
  position: Position;
  overlayX: ConnectedPositionX;
  overlayY: ConnectedPositionY;
  viewportMarginPx: number;
  injector: Injector;
  providers: StaticProvider[];
  isFullscreen?: boolean;
}
