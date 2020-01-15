import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AlertComponent } from './alert/alert.component';
import { CloseButtonComponent } from './close-button/close-button.component';
import { DrawerComponent } from './drawer/drawer.component';
import { LayoutComponent } from './layout.component';
import { ModalWindowComponent } from './modal-window/modal-window.component';
import { OverlayComponent } from './overlay/overlay.component';

const LAYOUT_COMPONENTS: any[] = [
  LayoutComponent,
  CloseButtonComponent,
  OverlayComponent,
  DrawerComponent,
  AlertComponent,
  ModalWindowComponent
];

@NgModule({
  imports: [SharedModule],
  declarations: [...LAYOUT_COMPONENTS],
  exports: [...LAYOUT_COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutModule {}
