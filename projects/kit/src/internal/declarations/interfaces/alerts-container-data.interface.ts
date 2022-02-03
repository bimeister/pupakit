import { ComponentPortal } from '@angular/cdk/portal';
import { Observable } from 'rxjs';

import { Theme } from '../enums/theme.enum';

export interface AlertsContainerData {
  componentPortals$: Observable<ComponentPortal<unknown>[]>;
  theme$: Observable<Theme>;
}
