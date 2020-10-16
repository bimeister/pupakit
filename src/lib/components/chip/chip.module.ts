import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { ChipComponent } from './components/chip/chip.component';

@NgModule({
  declarations: [ChipComponent],
  imports: [SharedModule],
  exports: [ChipComponent]
})
export class ChipModule {}
