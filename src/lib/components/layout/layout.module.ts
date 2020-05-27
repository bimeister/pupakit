import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '../../../internal/shared/shared.module';
import { AlertComponent } from './components/alert/alert.component';
import { CloseButtonComponent } from './components/close-button/close-button.component';
import { DrawerPaneComponent } from './components/drawer-pane/drawer-pane.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ModalWindowComponent } from './components/modal-window/modal-window.component';
import { OverlayComponent } from './components/overlay/overlay.component';
import { TooltipPaneComponent } from './components/tooltip-pane/tooltip-pane.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    AlertComponent,
    CloseButtonComponent,
    DrawerPaneComponent,
    LayoutComponent,
    LoaderComponent,
    ModalWindowComponent,
    OverlayComponent,
    TooltipPaneComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [LayoutComponent, LoaderComponent]
})
export class LayoutModule {}
