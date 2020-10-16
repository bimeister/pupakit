import { NgModule } from '@angular/core';

import { ChipModule } from '../chip/chip.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { ChipButtonComponent } from './components/chip-button/chip-button.component';

@NgModule({
  declarations: [ChipButtonComponent],
  imports: [SharedModule, ChipModule],
  exports: [ChipButtonComponent]
})
export class ChipButtonModule {}
