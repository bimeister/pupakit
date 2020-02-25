import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { ChipButtonComponent } from './components/chip-button/chip-button.component';

@NgModule({
  declarations: [ChipButtonComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ChipButtonComponent]
})
export class ChipButtonModule {}
