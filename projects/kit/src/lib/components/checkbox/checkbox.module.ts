import { NgModule } from '@angular/core';
import { appCheckboxMinusIcon } from '../../../internal/constants/icons/app-checkbox-minus-icon.const';
import { appExceptionsCheck10Icon } from '../../../internal/constants/icons/app-exceptions-check-10-icon.const';
import { SharedModule } from '../../../internal/shared/shared.module';
import { IconModule } from '../icon/icon.module';
import { CheckboxHintComponent } from './components/checkbox-hint/checkbox-hint.component';
import { CheckboxLabelComponent } from './components/checkbox-label/checkbox-label.component';
import { CheckboxMarkComponent } from './components/checkbox-mark/checkbox-mark.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';

@NgModule({
  declarations: [CheckboxMarkComponent, CheckboxComponent, CheckboxLabelComponent, CheckboxHintComponent],
  imports: [SharedModule, IconModule.forFeature([appExceptionsCheck10Icon, appCheckboxMinusIcon])],
  exports: [CheckboxMarkComponent, CheckboxComponent, CheckboxLabelComponent, CheckboxHintComponent],
})
export class CheckboxModule {}
