import { Injector, StaticProvider } from '@angular/core';

import { Position } from '../types/position.type';

export interface ModalConfig {
  hasBackdrop: boolean;
  closeOnBackdropClick: boolean;
  isBackdropTransparent: boolean;
  position: Position;
  viewportMarginPx: number;
  injector: Injector;
  providers: StaticProvider[];
}
