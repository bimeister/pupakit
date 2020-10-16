import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { DrawerDraggerComponent } from './components/drawer-dragger/drawer-dragger.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { IconModule } from '../icon/icon.module';
import { mdMoreIcon } from '../../../internal/constants/icons/md-more-icon.const';

@NgModule({
  declarations: [DrawerComponent, DrawerDraggerComponent],
  imports: [SharedModule, IconModule.forFeature([mdMoreIcon])],
  exports: [DrawerComponent, DrawerDraggerComponent]
})
export class DrawerModule {}
