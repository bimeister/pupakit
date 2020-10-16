import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { IconButtonModule } from '../icon-button/icon-button.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { DrawerContainerComponent } from './components/drawer-container/drawer-container.component';
import { DrawerDraggerComponent } from './components/drawer-dragger/drawer-dragger.component';
import { DrawerLayoutComponent } from './components/drawer-layout/drawer-layout.component';
import { DrawerComponent } from './components/drawer/drawer.component';

@NgModule({
  declarations: [DrawerComponent, DrawerDraggerComponent, DrawerContainerComponent, DrawerLayoutComponent],
  imports: [SharedModule, IconButtonModule, OverlayModule, PortalModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DrawerComponent, DrawerDraggerComponent, DrawerLayoutComponent, OverlayModule, PortalModule]
})
export class DrawerModule {}
