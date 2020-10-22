import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { TabsComponent } from './components/tabs/tabs.component';
import { IconModule } from '../icon/icon.module';

@NgModule({
  declarations: [TabsComponent],
  imports: [SharedModule, IconModule.forFeature()],
  exports: [TabsComponent]
})
export class TabsModule {}
