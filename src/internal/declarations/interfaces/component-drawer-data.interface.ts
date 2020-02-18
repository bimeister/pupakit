import { ComponentFactory, Injector } from '@angular/core';

import { LayoutDrawerConfiguration } from './layout-drawer-configuration.interface';

export interface ComponentDrawerData extends LayoutDrawerConfiguration {
  id: string;
  componentFactory: ComponentFactory<any>;
  injector?: Injector;
}
