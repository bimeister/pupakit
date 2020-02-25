import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../internal/shared/shared.module';
import { TabsComponent } from './components/tabs/tabs.component';

@NgModule({
  declarations: [TabsComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [TabsComponent]
})
export class TabsModule {}
