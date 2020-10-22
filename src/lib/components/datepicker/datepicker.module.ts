import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { IconModule } from '../icon/icon.module';
import { iosArrowBackIcon } from '../../../internal/constants/icons/ios-arrow-back-icon.const';
import { iosArrowForwardIcon } from '../../../internal/constants/icons/ios-arrow-forward-icon.const';

@NgModule({
  declarations: [DatepickerComponent],
  imports: [SharedModule, IconModule.forFeature([iosArrowBackIcon, iosArrowForwardIcon])],
  exports: [DatepickerComponent]
})
export class DatepickerModule {}
