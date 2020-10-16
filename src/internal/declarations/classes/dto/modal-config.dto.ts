import { Injector, StaticProvider } from '@angular/core';
import { isNil } from '@meistersoft/utilities';

import { ModalConfig } from '../../interfaces/modal-config.interface';
import { Position } from '../../types/position.type';

export class ModalConfigDto implements ModalConfig {
  public hasBackdrop: boolean = true;
  public closeOnBackdropClick: boolean = true;
  public isBackdropTransparent: boolean = false;
  public position: Position = null;
  public viewportMarginPx: number = 0;
  public injector: Injector = null;
  public providers: StaticProvider[] = [];

  constructor(config: Partial<ModalConfig>) {
    if (isNil(config)) {
      return;
    }
    Object.assign(this, config);
  }
}
