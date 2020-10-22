import { NgModule } from '@angular/core';

import { DatepickerModule } from '../datepicker/datepicker.module';
import { DroppableModule } from '../droppable/droppable.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { InputDateRangeComponent } from './components/input-date-range/input-date-range.component';
import { InputDateComponent } from './components/input-date/input-date.component';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { InputPasswordComponent } from './components/input-password/input-password.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { IconModule } from '../icon/icon.module';
import { iosCalendarIcon } from '../../../internal/constants/icons/ios-calendar-icon.const';

const EXPORTS: any[] = [
  InputTextComponent,
  InputPasswordComponent,
  InputDateComponent,
  InputDateRangeComponent,
  InputNumberComponent
];

const DECLARATIONS: any[] = [...EXPORTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [SharedModule, DatepickerModule, DroppableModule, IconModule.forFeature([iosCalendarIcon])],
  exports: [...EXPORTS]
})
export class InputModule {}
