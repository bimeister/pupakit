import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PupaPipesModule } from '@bimeister/pupakit.common';
import { PupaIconsModule, iosArrowBackIcon, iosArrowForwardIcon } from '@bimeister/pupakit.icons';
import { DatePickerDoubleComponent } from './components/date-picker-double/date-picker-double.component';
import { DatePickerMonthsComponent } from './components/date-picker-months/date-picker-months.component';
import { DatePickerSimpleTimeComponent } from './components/date-picker-simple-time/date-picker-simple-time.component';
import { DatePickerSimpleComponent } from './components/date-picker-simple/date-picker-simple.component';
import { DatePickerYearsComponent } from './components/date-picker-years/date-picker-years.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { TimePickerDigitsComponent } from './components/time-picker-digits/time-picker-digits.component';
import { TimePickerSimpleComponent } from './components/time-picker-simple/time-picker-simple.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';

const EXPORTS: any[] = [DatePickerComponent, TimePickerComponent];

const DECLARATIONS: any[] = [
  DatePickerComponent,
  DatePickerSimpleComponent,
  DatePickerDoubleComponent,
  DatePickerYearsComponent,
  DatePickerMonthsComponent,
  TimePickerComponent,
  TimePickerSimpleComponent,
  TimePickerDigitsComponent,
  DatePickerSimpleTimeComponent,
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [
    CommonModule,
    ScrollingModule,
    PupaPipesModule,
    PupaIconsModule.forFeature([iosArrowBackIcon, iosArrowForwardIcon]),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...EXPORTS],
})
export class PupaDateTimePickerModule {}
