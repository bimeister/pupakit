import { Injector, StaticProvider } from '@angular/core';

export interface DrawerConfig {
  float: 'left' | 'right';
  hasBackdrop: boolean;
  closeOnBackdropClick: boolean;
  isBackdropTransparent: boolean;
  injector: Injector;
  providers: StaticProvider[];
}
