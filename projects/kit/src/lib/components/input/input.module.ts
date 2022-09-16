import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { mAbortIcon } from '../../../internal/constants/icons/m-abort-icon.const';
import { mCalendarIcon } from '../../../internal/constants/icons/m-calendar-icon.const';
import { mClockIcon } from '../../../internal/constants/icons/m-clock-icon.const';
import { mErrorIcon } from '../../../internal/constants/icons/m-error-icon.const';
import { mEyeClosedIcon } from '../../../internal/constants/icons/m-eye-closed-icon.const';
import { mEyeOpenIcon } from '../../../internal/constants/icons/m-eye-open-icon.const';
import { SharedModule } from '../../../internal/shared/shared.module';
import { DateTimePickerModule } from '../date-time-picker/date-time-picker.module';
import { DroppableModule } from '../droppable/droppable.module';
import { IconModule } from '../icon/icon.module';
import { TooltipModule } from '../tooltip/tooltip.module';
import { InputDateRangeDoubleComponent } from './components/input-date-range-double/input-date-range-double.component';
import { InputDateRangeComponent } from './components/input-date-range/input-date-range.component';
import { InputDateTimeSecondsComponent } from './components/input-date-time-seconds/input-date-time-seconds.component';
import { InputDateTimeComponent } from './components/input-date-time/input-date-time.component';
import { InputDateComponent } from './components/input-date/input-date.component';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { InputPasswordComponent } from './components/input-password/input-password.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { InputTimeComponent } from './components/input-time/input-time.component';

const EXPORTS: any[] = [
  InputTextComponent,
  InputPasswordComponent,
  InputDateComponent,
  InputNumberComponent,
  InputTimeComponent,
  InputDateTimeComponent,
  InputDateTimeSecondsComponent,
  InputDateRangeComponent,
  InputDateRangeDoubleComponent,
];

const DECLARATIONS: any[] = [...EXPORTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [
    SharedModule,
    DateTimePickerModule,
    DroppableModule,
    TooltipModule,
    IconModule.forFeature([mAbortIcon, mCalendarIcon, mErrorIcon, mEyeClosedIcon, mEyeOpenIcon, mClockIcon]),
    NgxMaskModule.forRoot(),
  ],
  exports: [...EXPORTS],
})
export class InputModule {}
