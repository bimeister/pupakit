import { ComponentType } from '@angular/cdk/portal';
import { Injector, StaticProvider } from '@angular/core';
import { DrawerLayoutConfig } from './drawer-layout-config.interface';

export interface DrawerConfig<ContainerComponent = null> extends DrawerLayoutConfig {
  containerComponent: ComponentType<ContainerComponent>;
  closeOnBackdropClick?: boolean;
  isBackdropTransparent?: boolean;
  injector?: Injector;
  providers?: StaticProvider[];
}
