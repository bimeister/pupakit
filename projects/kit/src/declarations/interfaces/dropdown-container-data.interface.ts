import { ComponentPortal } from '@angular/cdk/portal';
import { Theme } from '@bimeister/pupakit.common';

export interface DropdownContainerData<TComponent> {
  componentPortal: ComponentPortal<TComponent>;
  theme: Theme;
}
