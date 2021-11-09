import { ComponentPortal } from '@angular/cdk/portal';
import { DrawerLayoutConfig } from './drawer-layout-config.interface';

export interface DrawerContainerData<componentT> extends DrawerLayoutConfig {
  contentComponentPortal: ComponentPortal<componentT>;
}
