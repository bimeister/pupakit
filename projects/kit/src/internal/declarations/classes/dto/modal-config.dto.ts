import { Injector, StaticProvider } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { ModalConfig } from '../../interfaces/modal-config.interface';
import { Position } from '../../types/position.type';
import { ConnectedPositionX } from '../../types/connected-position-x.type';
import { ConnectedPositionY } from '../../types/connected-position-y.type';

export class ModalConfigDto implements ModalConfig {
  public hasBackdrop: boolean = true;
  public closeOnBackdropClick: boolean = true;
  public isBackdropTransparent: boolean = false;
  public position: Position = null;
  public overlayX: ConnectedPositionX = null;
  public overlayY: ConnectedPositionY = null;
  public viewportMarginPx: number = 0;
  public injector: Injector = null;
  public providers: StaticProvider[] = [];
  public width: number | string = 0;
  public height: number | string = 0;

  constructor(config: Partial<ModalConfig>) {
    if (isNil(config)) {
      return;
    }
    Object.assign(this, config);
  }
}
