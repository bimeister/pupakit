import { NgModule } from '@angular/core';

import { SharedModule } from '../../../internal/shared/shared.module';
import { VerticalTabsItemComponent } from './components/vertical-tabs-item/vertical-tabs-item.component';
import { VerticalTabsComponent } from './components/vertical-tabs/vertical-tabs.component';

@NgModule({
  declarations: [VerticalTabsComponent, VerticalTabsItemComponent],
  imports: [SharedModule],
  exports: [VerticalTabsComponent, VerticalTabsItemComponent]
})
export class VerticalTabsModule {}
