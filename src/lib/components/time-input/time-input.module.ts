import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TimeInputComponent } from './components/time-input/time-input.component';
import { SharedModule } from '../../../internal/api';

@NgModule({
  declarations: [TimeInputComponent],
  exports: [TimeInputComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimeInputModule { }
