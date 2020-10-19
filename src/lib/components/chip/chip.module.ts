import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { ChipComponent } from './components/chip/chip.component';

@NgModule({
  declarations: [ChipComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ChipComponent]
})
export class ChipModule {}
