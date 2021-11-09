import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { IconButtonModule } from '../icon-button/icon-button.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { DrawerContainerComponent } from './components/drawer-container/drawer-container.component';
import { DrawerDraggerComponent } from './components/drawer-dragger/drawer-dragger.component';
import { DrawerLayoutComponent } from './components/drawer-layout/drawer-layout.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { IconModule } from '../icon/icon.module';
import { mdMoreIcon } from '../../../internal/constants/icons/md-more-icon.const';
import { mdCloseIcon } from '../../../internal/constants/icons/md-close-icon.const';
import { DrawerLayoutHeaderComponent } from './components/drawer-layout-header/drawer-layout-header.component';
import { DrawerLayoutBodyComponent } from './components/drawer-layout-body/drawer-layout-body.component';
import { DrawerLayoutFooterComponent } from './components/drawer-layout-footer/drawer-layout-footer.component';
import { DrawerLayoutHeaderContentComponent } from './components/drawer-layout-header-content/drawer-layout-header-content.component';
import { DrawerCloseButtonComponent } from './components/drawer-close-button/drawer-close-button.component';
import { DrawerButtonIconComponent } from './components/drawer-button-icon/drawer-button-icon.component';
import { ButtonModule } from '../button/button.module';
import { DrawerLayoutHeaderRowComponent } from './components/drawer-layout-header-row/drawer-layout-header-row.component';
import { DrawerTitleComponent } from './components/drawer-title/drawer-title.component';
import { DrawerTitleContainerComponent } from './components/drawer-title-container/drawer-title-container.component';
import { DrawerLayoutSeparatorComponent } from './components/drawer-separator/drawer-layout-separator.component';
import { DrawerLayoutActionComponent } from './components/drawer-layout-action/drawer-layout-action.component';

@NgModule({
  declarations: [
    DrawerComponent,
    DrawerDraggerComponent,
    DrawerContainerComponent,
    DrawerLayoutComponent,
    DrawerLayoutHeaderComponent,
    DrawerLayoutBodyComponent,
    DrawerLayoutFooterComponent,
    DrawerLayoutHeaderContentComponent,
    DrawerCloseButtonComponent,
    DrawerButtonIconComponent,
    DrawerLayoutHeaderRowComponent,
    DrawerTitleComponent,
    DrawerTitleContainerComponent,
    DrawerLayoutSeparatorComponent,
    DrawerLayoutActionComponent
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
    DrawerComponent,
    DrawerDraggerComponent,
    DrawerLayoutComponent,
    OverlayModule,
    PortalModule,
    DrawerLayoutBodyComponent,
    DrawerLayoutFooterComponent,
    DrawerLayoutHeaderComponent,
    DrawerLayoutHeaderContentComponent,
    DrawerCloseButtonComponent,
    DrawerButtonIconComponent,
    DrawerLayoutHeaderRowComponent,
    DrawerTitleComponent,
    DrawerTitleContainerComponent,
    DrawerLayoutSeparatorComponent,
    DrawerLayoutActionComponent
  ]
})
export class DrawerModule {}
