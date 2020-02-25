import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';

@NgModule({
  declarations: [RadioGroupComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [RadioGroupComponent]
})
export class RadioGroupModule {}
