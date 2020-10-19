import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { DrawerDraggerComponent } from './components/drawer-dragger/drawer-dragger.component';
import { DrawerComponent } from './components/drawer/drawer.component';

@NgModule({
  declarations: [DrawerComponent, DrawerDraggerComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DrawerComponent, DrawerDraggerComponent]
})
export class DrawerModule {}
