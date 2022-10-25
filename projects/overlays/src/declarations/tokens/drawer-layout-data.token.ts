import { InjectionToken } from '@angular/core';

import { DrawerLayoutConfig } from '../../declarations/interfaces/drawer-layout-config.interface';

export const DRAWER_LAYOUT_CONFIG_TOKEN: InjectionToken<DrawerLayoutConfig> = new InjectionToken<DrawerLayoutConfig>(
  'DRAWER_LAYOUT_CONFIG_TOKEN'
);
