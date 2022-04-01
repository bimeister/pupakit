import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../../../internal/shared/shared.module';
import { ButtonModule } from '../button/button.module';
import { ScrollableModule } from '../scrollable/scrollable.module';
import { ThemeWrapperModule } from '../theme-wrapper/theme-wrapper.module';
import { ModalButtonIconComponent } from './components/modal-button-icon/modal-button-icon.component';
import { ModalCloseButtonComponent } from './components/modal-close-button/modal-close-button.component';
import { ModalContainerComponent } from './components/modal-container/modal-container.component';
import { ModalDraggerComponent } from './components/modal-dragger/modal-dragger.component';
import { ModalExpandButtonComponent } from './components/modal-expand-button/modal-expand-button.component';
import { ModalLayoutActionComponent } from './components/modal-layout-action/modal-layout-action.component';
import { ModalLayoutBodyComponent } from './components/modal-layout-body/modal-layout-body.component';
import { ModalLayoutFooterComponent } from './components/modal-layout-footer/modal-layout-footer.component';
import { ModalLayoutHeaderActionsComponent } from './components/modal-layout-header-actions/modal-layout-header-actions.component';
import { ModalLayoutHeaderComponent } from './components/modal-layout-header/modal-layout-header.component';
import { ModalLayoutTitleComponent } from './components/modal-layout-title/modal-layout-title.component';
import { ModalLayoutComponent } from './components/modal-layout/modal-layout.component';

@NgModule({
  declarations: [
    ModalContainerComponent,
    ModalLayoutComponent,
    ModalDraggerComponent,
    ModalLayoutHeaderComponent,
    ModalLayoutHeaderActionsComponent,
    ModalLayoutBodyComponent,
    ModalLayoutFooterComponent,
    ModalLayoutActionComponent,
    ModalLayoutTitleComponent,
    ModalButtonIconComponent,
    ModalCloseButtonComponent,
    ModalExpandButtonComponent,
  ],
  imports: [SharedModule, ButtonModule, OverlayModule, PortalModule, ThemeWrapperModule, ScrollableModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    ModalLayoutComponent,
    ModalLayoutHeaderComponent,
    ModalLayoutHeaderActionsComponent,
    ModalLayoutBodyComponent,
    ModalLayoutFooterComponent,
    ModalLayoutActionComponent,
    ModalLayoutTitleComponent,
    ModalButtonIconComponent,
    ModalCloseButtonComponent,
    ModalExpandButtonComponent,
    ModalDraggerComponent,
    OverlayModule,
    PortalModule,
  ],
})
export class ModalModule {}
