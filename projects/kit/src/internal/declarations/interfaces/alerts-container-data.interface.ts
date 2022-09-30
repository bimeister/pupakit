import { ComponentPortal } from '@angular/cdk/portal';
import { Observable } from 'rxjs';

export interface AlertsContainerData {
  componentPortals$: Observable<ComponentPortal<unknown>[]>;
}
