import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { appFitToPageIcon, appResizeIcon, mdCloseIcon, mdMoreIcon, PupaIconsModule } from '@bimeister/pupakit.icons';
import { PupaButtonsModule, PupaScrollableModule } from '@bimeister/pupakit.kit';
import { DrawerButtonIconComponent } from './components/drawer-button-icon/drawer-button-icon.component';
import { DrawerCloseButtonComponent } from './components/drawer-close-button/drawer-close-button.component';
import { DrawerContainerComponent } from './components/drawer-container/drawer-container.component';
import { DrawerExpandButtonComponent } from './components/drawer-expand-button/drawer-expand-button.component';
import { DrawerLayoutActionComponent } from './components/drawer-layout-action/drawer-layout-action.component';
import { DrawerLayoutBodyComponent } from './components/drawer-layout-body/drawer-layout-body.component';
import { DrawerLayoutFooterComponent } from './components/drawer-layout-footer/drawer-layout-footer.component';
import { DrawerLayoutHeaderContentComponent } from './components/drawer-layout-header-content/drawer-layout-header-content.component';
import { DrawerLayoutHeaderRowComponent } from './components/drawer-layout-header-row/drawer-layout-header-row.component';
import { DrawerLayoutHeaderTabsComponent } from './components/drawer-layout-header-tabs/drawer-layout-header-tabs.component';
import { DrawerLayoutHeaderComponent } from './components/drawer-layout-header/drawer-layout-header.component';
import { DrawerLayoutComponent } from './components/drawer-layout/drawer-layout.component';
import { DrawerLayoutSeparatorComponent } from './components/drawer-separator/drawer-layout-separator.component';
import { DrawerTitleComponent } from './components/drawer-title/drawer-title.component';
import { DrawerHeaderTabsActionsDirective } from './directives/drawer-header-tabs-actions.directive';
import { PupaDirectivesModule } from '@bimeister/pupakit.common';

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
    DrawerLayoutSeparatorComponent,
    DrawerLayoutActionComponent,
    DrawerExpandButtonComponent,
    DrawerLayoutHeaderTabsComponent,
    DrawerHeaderTabsActionsDirective,
  ],
  imports: [
    CommonModule,
    OverlayModule,
    PortalModule,
    PupaIconsModule.forFeature([mdMoreIcon, mdCloseIcon, appFitToPageIcon, appResizeIcon]),
    PupaButtonsModule,
    PupaScrollableModule,
    PupaDirectivesModule,
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
    DrawerLayoutSeparatorComponent,
    DrawerLayoutActionComponent,
    DrawerExpandButtonComponent,
    DrawerLayoutHeaderTabsComponent,
    DrawerHeaderTabsActionsDirective,
  ],
})
export class PupaDrawerModule {}
