import { appCheckboxMinusIcon } from '../../../internal/constants/icons/app-checkbox-minus-icon.const';
import { appCheckboxCheckIcon } from '../../../internal/constants/icons/app-checkbox-check-icon';
import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { CheckboxMarkComponent } from './components/checkbox-mark/checkbox-mark.component';
import { IconModule } from '../icon/icon.module';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { CheckboxLabelComponent } from './components/checkbox-label/checkbox-label.component';
import { CheckboxHintComponent } from './components/checkbox-hint/checkbox-hint.component';

@NgModule({
  declarations: [CheckboxMarkComponent, CheckboxComponent, CheckboxLabelComponent, CheckboxHintComponent],
  imports: [SharedModule, IconModule.forFeature([appCheckboxCheckIcon, appCheckboxMinusIcon])],
  exports: [CheckboxMarkComponent, CheckboxComponent, CheckboxLabelComponent, CheckboxHintComponent]
})
export class CheckboxModule {}
