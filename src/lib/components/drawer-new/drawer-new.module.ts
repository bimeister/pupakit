import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { IconButtonModule } from '../icon-button/icon-button.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { DrawerContainerNewComponent } from './components/drawer-container-new/drawer-container-new.component';
import { DrawerLayoutNewComponent } from './components/drawer-layout-new/drawer-layout-new.component';
import { IconModule } from '../icon/icon.module';
import { mdMoreIcon } from '../../../internal/constants/icons/md-more-icon.const';
import { mdCloseIcon } from '../../../internal/constants/icons/md-close-icon.const';
import { DrawerLayoutHeaderNewComponent } from './components/drawer-layout-header-new/drawer-layout-header-new.component';
import { DrawerLayoutBodyNewComponent } from './components/drawer-layout-body-new/drawer-layout-body-new.component';
import { DrawerLayoutFooterNewComponent } from './components/drawer-layout-footer-new/drawer-layout-footer-new.component';
import { DrawerLayoutHeaderContentNewComponent } from './components/drawer-layout-header-content-new/drawer-layout-header-content-new.component';
import { DrawerCloseButtonNewComponent } from './components/drawer-close-button-new/drawer-close-button-new.component';
import { DrawerButtonIconNewComponent } from './components/drawer-button-icon-new/drawer-button-icon-new.component';
import { ButtonModule } from '../button/button.module';
import { DrawerLayoutHeaderRowNewComponent } from './components/drawer-layout-header-row-new/drawer-layout-header-row-new.component';
import { DrawerTitleNewComponent } from './components/drawer-title-new/drawer-title-new.component';
import { DrawerTitleContainerNewComponent } from './components/drawer-title-container-new/drawer-title-container-new.component';
import { DrawerLayoutSeparatorNewComponent } from './components/drawer-separator-new/drawer-layout-separator-new.component';
import { DrawerLayoutActionNewComponent } from './components/drawer-layout-action-new/drawer-layout-action-new.component';

@NgModule({
  declarations: [
    DrawerContainerNewComponent,
    DrawerLayoutNewComponent,
    DrawerLayoutHeaderNewComponent,
    DrawerLayoutBodyNewComponent,
    DrawerLayoutFooterNewComponent,
    DrawerLayoutHeaderContentNewComponent,
    DrawerCloseButtonNewComponent,
    DrawerButtonIconNewComponent,
    DrawerLayoutHeaderRowNewComponent,
    DrawerTitleNewComponent,
    DrawerTitleContainerNewComponent,
    DrawerLayoutSeparatorNewComponent,
    DrawerLayoutActionNewComponent
  ],
  imports: [
    SharedModule,
    IconButtonModule,
    OverlayModule,
    PortalModule,
    IconModule.forFeature([mdMoreIcon, mdCloseIcon]),
    ButtonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    DrawerLayoutNewComponent,
    OverlayModule,
    PortalModule,
    DrawerLayoutBodyNewComponent,
    DrawerLayoutFooterNewComponent,
    DrawerLayoutHeaderNewComponent,
    DrawerLayoutHeaderContentNewComponent,
    DrawerCloseButtonNewComponent,
    DrawerButtonIconNewComponent,
    DrawerLayoutHeaderRowNewComponent,
    DrawerTitleNewComponent,
    DrawerTitleContainerNewComponent,
    DrawerLayoutSeparatorNewComponent,
    DrawerLayoutActionNewComponent
  ]
})
export class DrawerNewModule {}
