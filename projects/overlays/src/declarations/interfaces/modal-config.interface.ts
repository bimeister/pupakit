import { Injector, StaticProvider } from '@angular/core';
import { Position } from '@bimeister/pupakit.common';

import { ConnectedPositionX } from '../types/connected-position-x.type';
import { ConnectedPositionY } from '../types/connected-position-y.type';
import { ModalHeightType } from '../types/modal-height.type';

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
  height?: ModalHeightType;
  hasBorder?: boolean;
}
