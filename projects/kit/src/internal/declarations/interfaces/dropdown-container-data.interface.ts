import { ComponentPortal } from '@angular/cdk/portal';
import { Theme } from '../../../internal/declarations/enums/theme.enum';
import { Observable } from 'rxjs';

export interface DropdownContainerData<TComponent> {
  componentPortal: ComponentPortal<TComponent>;
  theme$: Observable<Theme>;
}
