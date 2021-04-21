import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { CheckboxMarkComponent } from './components/checkbox-mark/checkbox-mark.component';
import { IconModule } from '../icon/icon.module';
import { iosCheckmarkIcon } from '../../../internal/constants/icons/ios-checkmark-icon.const';
import { iosSquareIcon } from '../../../internal/constants/icons/ios-square-icon.const';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { CheckboxLabelComponent } from './components/checkbox-label/checkbox-label.component';
import { CheckboxHintComponent } from './components/checkbox-hint/checkbox-hint.component';

@NgModule({
  declarations: [CheckboxMarkComponent, CheckboxComponent, CheckboxLabelComponent, CheckboxHintComponent],
  imports: [SharedModule, IconModule.forFeature([iosCheckmarkIcon, iosSquareIcon])],
  exports: [CheckboxMarkComponent, CheckboxComponent, CheckboxLabelComponent, CheckboxHintComponent]
})
export class CheckboxModule {}
