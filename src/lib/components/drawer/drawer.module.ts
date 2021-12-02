import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { mdCloseIcon } from '../../../internal/constants/icons/md-close-icon.const';
import { mdMoreIcon } from '../../../internal/constants/icons/md-more-icon.const';
import { ButtonModule } from '../button/button.module';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { IconModule } from '../icon/icon.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { DrawerButtonIconComponent } from './components/drawer-button-icon/drawer-button-icon.component';
import { DrawerCloseButtonComponent } from './components/drawer-close-button/drawer-close-button.component';
import { DrawerContainerComponent } from './components/drawer-container/drawer-container.component';
import { DrawerExpandButtonComponent } from './components/drawer-expand-button/drawer-expand-button.component';
import { DrawerLayoutActionComponent } from './components/drawer-layout-action/drawer-layout-action.component';
import { DrawerLayoutBodyComponent } from './components/drawer-layout-body/drawer-layout-body.component';
import { DrawerLayoutFooterComponent } from './components/drawer-layout-footer/drawer-layout-footer.component';
import { DrawerLayoutHeaderContentComponent } from './components/drawer-layout-header-content/drawer-layout-header-content.component';
import { DrawerLayoutHeaderRowComponent } from './components/drawer-layout-header-row/drawer-layout-header-row.component';
import { DrawerLayoutHeaderComponent } from './components/drawer-layout-header/drawer-layout-header.component';
import { DrawerLayoutComponent } from './components/drawer-layout/drawer-layout.component';
import { DrawerLayoutSeparatorComponent } from './components/drawer-separator/drawer-layout-separator.component';
import { DrawerTitleContainerComponent } from './components/drawer-title-container/drawer-title-container.component';
import { DrawerTitleComponent } from './components/drawer-title/drawer-title.component';

@NgModule({
  declarations: [
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
    DrawerLayoutActionComponent,
    DrawerExpandButtonComponent,
  ],
  imports: [
    SharedModule,
    IconButtonModule,
    OverlayModule,
    PortalModule,
    IconModule.forFeature([mdMoreIcon, mdCloseIcon]),
    ButtonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
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
    DrawerLayoutActionComponent,
    DrawerExpandButtonComponent,
  ],
})
export class DrawerModule {}
