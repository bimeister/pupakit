import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { IconModule } from '../icon/icon.module';
import { iosCheckmarkIcon } from '../../../internal/constants/icons/ios-checkmark-icon.const';
import { iosSquareIcon } from '../../../internal/constants/icons/ios-square-icon.const';

@NgModule({
  declarations: [CheckboxComponent],
  imports: [SharedModule, IconModule.forFeature([iosCheckmarkIcon, iosSquareIcon])],
  exports: [CheckboxComponent]
})
export class CheckboxModule {}
