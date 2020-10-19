import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TimeInputComponent } from './components/time-input/time-input.component';
import { SharedModule } from '../../../internal/shared/shared.module';
import { TimeInputControlComponent } from './components/time-input-control/time-input-control.component';
import { TimeInputSeparatorComponent } from './components/time-input-separator/time-input-separator.component';

@NgModule({
  declarations: [TimeInputComponent, TimeInputControlComponent, TimeInputSeparatorComponent],
  exports: [TimeInputComponent, TimeInputControlComponent, TimeInputSeparatorComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimeInputModule {}
