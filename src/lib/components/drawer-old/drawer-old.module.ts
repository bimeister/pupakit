import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { IconButtonModule } from '../icon-button/icon-button.module';
import { SharedModule } from './../../../internal/shared/shared.module';

import { DrawerContainerOldComponent } from './components/drawer-container-old/drawer-container-old.component';
import { DrawerDraggerOldComponent } from './components/drawer-dragger-old/drawer-dragger-old.component';
import { DrawerLayoutOldComponent } from './components/drawer-layout-old/drawer-layout-old.component';
import { DrawerOldComponent } from './components/drawer-old/drawer-old.component';
import { IconModule } from '../icon/icon.module';
import { mdMoreIcon } from '../../../internal/constants/icons/md-more-icon.const';
import { mdCloseIcon } from '../../../internal/constants/icons/md-close-icon.const';

@NgModule({
  declarations: [DrawerOldComponent, DrawerDraggerOldComponent, DrawerContainerOldComponent, DrawerLayoutOldComponent],
  imports: [
    SharedModule,
    IconButtonModule,
    OverlayModule,
    PortalModule,
    IconModule.forFeature([mdMoreIcon, mdCloseIcon]),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DrawerOldComponent, DrawerDraggerOldComponent, DrawerLayoutOldComponent, OverlayModule, PortalModule],
})
export class DrawerOldModule {}
