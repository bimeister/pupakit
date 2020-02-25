import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { RadioButtonComponent } from './components/radio-button/radio-button.component';

@NgModule({
  declarations: [RadioButtonComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [RadioButtonComponent]
})
export class RadioButtonModule {}
