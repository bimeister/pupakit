import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { TabsComponent } from './components/tabs/tabs.component';
import { IconModule } from '../icon/icon.module';
import { TabsItemComponent } from './components/tabs-item/tabs-item.component';

@NgModule({
  declarations: [TabsComponent, TabsItemComponent],
  imports: [SharedModule, IconModule.forFeature()],
  exports: [TabsComponent, TabsItemComponent]
})
export class TabsModule {}
