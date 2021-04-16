import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { IconModule } from '../icon/icon.module';
import { iosCheckmarkIcon } from '../../../internal/constants/icons/ios-checkmark-icon.const';
import { iosSquareIcon } from '../../../internal/constants/icons/ios-square-icon.const';
import { CheckboxWrapperComponent } from './components/checkbox-wrapper/checkbox-wrapper.component';

@NgModule({
  declarations: [CheckboxComponent, CheckboxWrapperComponent],
  imports: [SharedModule, IconModule.forFeature([iosCheckmarkIcon, iosSquareIcon])],
  exports: [CheckboxComponent, CheckboxWrapperComponent]
})
export class CheckboxModule {}
