import { ComponentPortal } from '@angular/cdk/portal';
import { Theme } from '../../../internal/declarations/enums/theme.enum';

export interface DropdownContainerData<TComponent> {
  componentPortal: ComponentPortal<TComponent>;
  theme: Theme;
}
