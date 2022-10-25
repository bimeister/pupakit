import { ConnectedOverlayPositionChange } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Observable } from 'rxjs';

export interface PopoverContainerData {
  componentPortal: ComponentPortal<unknown>;
  positionChanges$: Observable<ConnectedOverlayPositionChange>;
}
