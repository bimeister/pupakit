import { ComponentPortal } from '@angular/cdk/portal';

export interface ModalContainerData<componentT> {
  contentComponentPortal: ComponentPortal<componentT>;
}
