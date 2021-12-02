import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { iosCalendarIcon } from '../../../internal/constants/icons/ios-calendar-icon.const';
import { mdAlertIcon } from '../../../internal/constants/icons/md-alert-icon.const';
import { mdCloseCircleIcon } from '../../../internal/constants/icons/md-close-circle-icon.const';
import { mdTimeIcon } from '../../../internal/constants/icons/md-time-icon.const';
import { DateTimePickerModule } from '../date-time-picker/date-time-picker.module';
import { DroppableModule } from '../droppable/droppable.module';
import { IconModule } from '../icon/icon.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { InputDateRangeDoubleComponent } from './components/input-date-range-double/input-date-range-double.component';
import { InputDateTimeSecondsComponent } from './components/input-date-time-seconds/input-date-time-seconds.component';
import { InputDateTimeComponent } from './components/input-date-time/input-date-time.component';
import { InputDateComponent } from './components/input-date/input-date.component';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { InputPasswordComponent } from './components/input-password/input-password.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { InputTimeSecondsComponent } from './components/input-time-seconds/input-time-seconds.component';
import { InputTimeComponent } from './components/input-time/input-time.component';
import { InputDateRangeComponent } from './components/input-date-range/input-date-range.component';
import { ButtonModule } from '../button/button.module';
import { appEyeOnIcon } from '../../../internal/constants/icons/app-eye-on-icon.const';
import { appEyeOffIcon } from '../../../internal/constants/icons/app-eye-off-icon.const';
import { TooltipModule } from '../tooltip/tooltip.module';
import { appCrossCircleIcon, iosHelpCircleIcon } from '../../../public-api';

const EXPORTS: any[] = [
  InputTextComponent,
  InputPasswordComponent,
  InputDateComponent,
  InputNumberComponent,
  InputTimeComponent,
  InputTimeSecondsComponent,
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
    ButtonModule,
    TooltipModule,
    IconModule.forFeature([
      iosCalendarIcon,
      mdTimeIcon,
      mdCloseCircleIcon,
      mdAlertIcon,
      appEyeOnIcon,
      appEyeOffIcon,
      iosHelpCircleIcon,
      appCrossCircleIcon,
    ]),
    NgxMaskModule.forRoot(),
  ],
  exports: [...EXPORTS],
})
export class InputModule {}
