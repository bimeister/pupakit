import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../internal/shared/shared.module';
import { ChipTabsItemComponent } from './components/chip-tabs-item/chip-tabs-item.component';
import { ChipTabsComponent } from './components/chip-tabs/chip-tabs.component';

@NgModule({
  declarations: [ChipTabsComponent, ChipTabsItemComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ChipTabsComponent, ChipTabsItemComponent]
})
export class ChipTabsModule {}
