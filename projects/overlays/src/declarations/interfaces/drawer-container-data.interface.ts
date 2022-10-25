import { ComponentPortal } from '@angular/cdk/portal';
import { DrawerLayoutConfig } from './drawer-layout-config.interface';

export interface DrawerContainerData<ComponentT> extends DrawerLayoutConfig {
  contentComponentPortal: ComponentPortal<ComponentT>;
}
