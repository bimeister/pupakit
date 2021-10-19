import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { IconButtonModule } from '../icon-button/icon-button.module';
import { SharedModule } from '../../../internal/shared/shared.module';
import { ModalContainerComponent } from './components/modal-container/modal-container.component';
import { ModalDraggerComponent } from './components/modal-dragger/modal-dragger.component';
import { ModalLayoutComponent } from './components/modal-layout/modal-layout.component';
import { ModalLayoutHeaderComponent } from './components/modal-layout-header/modal-layout-header.component';
import { ModalLayoutBodyComponent } from './components/modal-layout-body/modal-layout-body.component';
import { ModalLayoutFooterComponent } from './components/modal-layout-footer/modal-layout-footer.component';
import { ModalLayoutActionComponent } from './components/modal-layout-action/modal-layout-action.component';
import { ModalLayoutTitleComponent } from './components/modal-layout-title/modal-layout-title.component';
import { ModalLayoutCloseButtonComponent } from './components/modal-layout-close-button/modal-layout-close-button.component';
import { ScrollableModule } from '../scrollable/scrollable.module';

@NgModule({
  declarations: [
    ModalContainerComponent,
    ModalLayoutComponent,
    ModalDraggerComponent,
    ModalLayoutHeaderComponent,
    ModalLayoutBodyComponent,
    ModalLayoutFooterComponent,
    ModalLayoutActionComponent,
    ModalLayoutTitleComponent,
    ModalLayoutCloseButtonComponent
  ],
  imports: [SharedModule, IconButtonModule, OverlayModule, PortalModule, ScrollableModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    ModalLayoutComponent,
    ModalLayoutHeaderComponent,
    ModalLayoutBodyComponent,
    ModalLayoutFooterComponent,
    ModalLayoutActionComponent,
    ModalLayoutTitleComponent,
    ModalLayoutCloseButtonComponent,
    ModalDraggerComponent,
    OverlayModule,
    PortalModule
  ]
})
export class ModalModule {}
