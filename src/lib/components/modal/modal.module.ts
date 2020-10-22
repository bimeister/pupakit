import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { IconButtonModule } from '../icon-button/icon-button.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { ModalContainerComponent } from './components/modal-container/modal-container.component';
import { ModalDraggerComponent } from './components/modal-dragger/modal-dragger.component';
import { ModalLayoutComponent } from './components/modal-layout/modal-layout.component';
import { IconModule } from '../icon/icon.module';
import { mdCloseIcon } from '../../../internal/constants/icons/md-close-icon.const';

@NgModule({
  declarations: [ModalContainerComponent, ModalLayoutComponent, ModalDraggerComponent],
  imports: [SharedModule, IconButtonModule, OverlayModule, PortalModule, IconModule.forFeature([mdCloseIcon])],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ModalLayoutComponent, ModalDraggerComponent, OverlayModule, PortalModule]
})
export class ModalModule {}
