import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../internal/shared/shared.module';
import { DaySelectorComponent } from './components/day-selector/day-selector.component';

@NgModule({
  declarations: [DaySelectorComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DaySelectorComponent]
})
export class DaySelectorModule {}
