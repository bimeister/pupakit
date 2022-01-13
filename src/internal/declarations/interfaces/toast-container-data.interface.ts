import { ComponentPortal } from '@angular/cdk/portal';
import { Observable } from 'rxjs';

import { Theme } from '../enums/theme.enum';

export interface ToastContainerData {
  componentPortal: ComponentPortal<unknown>;
  theme$: Observable<Theme>;
}
