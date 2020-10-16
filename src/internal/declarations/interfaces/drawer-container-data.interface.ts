import { ComponentPortal } from '@angular/cdk/portal';

export interface DrawerContainerData<componentT> {
  contentComponentPortal: ComponentPortal<componentT>;
  float: 'left' | 'right';
}
