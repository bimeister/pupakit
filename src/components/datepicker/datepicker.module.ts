import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../internal/shared/shared.module';
import { DatepickerComponent } from './components/datepicker/datepicker.component';

@NgModule({
  declarations: [DatepickerComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DatepickerComponent]
})
export class DatepickerModule {}
