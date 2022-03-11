import { NgModule } from '@angular/core';
import { appCheckboxMinusIcon } from '../../../internal/constants/icons/app-checkbox-minus-icon.const';
import { appExceptionsCheck10Icon } from '../../../internal/constants/icons/app-exceptions-check-10-icon.const';
import { SharedModule } from '../../../internal/shared/shared.module';
import { IconModule } from '../icon/icon.module';
import { CheckboxComponent } from './components/checkbox/checkbox.component';

@NgModule({
  declarations: [CheckboxComponent],
  imports: [SharedModule, IconModule.forFeature([appExceptionsCheck10Icon, appCheckboxMinusIcon])],
  exports: [CheckboxComponent],
})
export class CheckboxModule {}
