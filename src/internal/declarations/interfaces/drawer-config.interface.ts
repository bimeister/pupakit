import { Injector, StaticProvider } from '@angular/core';
import { DrawerLayoutConfig } from './drawer-layout-config.interface';

export interface DrawerConfig extends DrawerLayoutConfig {
  closeOnBackdropClick: boolean;
  isBackdropTransparent: boolean;
  injector: Injector;
  providers: StaticProvider[];
}
