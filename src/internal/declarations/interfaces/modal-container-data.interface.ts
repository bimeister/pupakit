import { ComponentPortal } from '@angular/cdk/portal';

export interface ModalContainerData<ComponentT> {
  contentComponentPortal: ComponentPortal<ComponentT>;
}
