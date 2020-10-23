import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { DatePickerDoubleComponent } from './components/date-picker-double/date-picker-double.component';
import { DatePickerSimpleComponent } from './components/date-picker-simple/date-picker-simple.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { IconModule } from '../icon/icon.module';
import { iosArrowBackIcon } from '../../../internal/constants/icons/ios-arrow-back-icon.const';
import { iosArrowForwardIcon } from '../../../internal/constants/icons/ios-arrow-forward-icon.const';
import { DatePickerYearsComponent } from './components/date-picker-years/date-picker-years.component';
import { DatePickerMonthsComponent } from './components/date-picker-months/date-picker-months.component';

const EXPORTS: any[] = [
  DatePickerComponent,
  DatePickerSimpleComponent,
  DatePickerDoubleComponent,
  DatePickerYearsComponent,
  DatePickerMonthsComponent
];

const DECLARATIONS: any[] = [...EXPORTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [SharedModule, IconModule.forFeature([iosArrowBackIcon, iosArrowForwardIcon])],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...EXPORTS]
})
export class DateTimePickerModule {}
