import { NgModule } from '@angular/core';
import { iosCalendarIcon } from '../../../internal/constants/icons/ios-calendar-icon.const';
import { mdTimeIcon } from '../../../internal/constants/icons/md-time-icon.const';
import { DateTimePickerModule } from '../date-time-picker/date-time-picker.module';
import { DatepickerModule } from '../datepicker/datepicker.module';
import { DroppableModule } from '../droppable/droppable.module';
import { IconModule } from '../icon/icon.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { InputDateRangeComponent } from './components/input-date-range/input-date-range.component';
import { InputDateComponent } from './components/input-date/input-date.component';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { InputPasswordComponent } from './components/input-password/input-password.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { InputTimeComponent } from './components/input-time/input-time.component';
import { NgxMaskModule } from 'ngx-mask';
import { mdCloseCircleIcon } from '../../../internal/constants/icons/md-close-circle-icon.const';
import { mdAlertIcon } from '../../../internal/constants/icons/md-alert-icon.const';
import { InputTimeSecondsComponent } from './components/input-time-seconds/input-time-seconds.component';
import { InputDateTimeComponent } from './components/input-date-time/input-date-time.component';
import { InputDateTimeSecondsComponent } from './components/input-date-time-seconds/input-date-time-seconds.component';

const EXPORTS: any[] = [
  InputTextComponent,
  InputPasswordComponent,
  InputDateComponent,
  InputDateRangeComponent,
  InputNumberComponent,
  InputTimeComponent,
  InputTimeSecondsComponent,
  InputDateTimeComponent,
  InputDateTimeSecondsComponent
];

const DECLARATIONS: any[] = [...EXPORTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [
    SharedModule,
    DatepickerModule,
    DateTimePickerModule,
    DroppableModule,
    IconModule.forFeature([iosCalendarIcon, mdTimeIcon, mdCloseCircleIcon, mdAlertIcon]),
    NgxMaskModule.forRoot()
  ],
  exports: [...EXPORTS]
})
export class InputModule {}
