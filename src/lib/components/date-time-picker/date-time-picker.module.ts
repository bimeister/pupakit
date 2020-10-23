import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { DatePickerDoubleComponent } from './components/date-picker-double/date-picker-double.component';
import { DatePickerSimpleComponent } from './components/date-picker-simple/date-picker-simple.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';

const EXPORTS: any[] = [DatePickerComponent, DatePickerSimpleComponent, DatePickerDoubleComponent];

const DECLARATIONS: any[] = [...EXPORTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...EXPORTS]
})
export class DateTimePickerModule {}
