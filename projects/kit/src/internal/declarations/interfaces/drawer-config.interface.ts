import { Injector, StaticProvider } from '@angular/core';
import { DrawerLayoutConfig } from './drawer-layout-config.interface';
import { ComponentType } from '@angular/cdk/portal';
import { Theme } from '../enums/theme.enum';

export interface DrawerConfig<ContainerComponent = null> extends DrawerLayoutConfig {
  closeOnBackdropClick: boolean;
  isBackdropTransparent: boolean;
  injector: Injector;
  providers: StaticProvider[];
  containerComponent?: ComponentType<ContainerComponent>;
  theme?: Theme;
}
