import { Injector, StaticProvider } from '@angular/core';
import { isNil } from '@bimeister/utilities/commonjs/common';
import { DrawerConfig } from '../../interfaces/drawer-config.interface';

export class DrawerConfigDto implements DrawerConfig {
  public float: 'left' | 'right' = 'right';
  public hasBackdrop: boolean = true;
  public closeOnBackdropClick: boolean = true;
  public isBackdropTransparent: boolean = false;
  public injector: Injector = null;
  public providers: StaticProvider[] = [];

  constructor(config: Partial<DrawerConfig>) {
    if (isNil(config)) {
      return;
    }
    Object.assign(this, config);
  }
}
