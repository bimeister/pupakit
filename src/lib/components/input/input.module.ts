import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { DatepickerModule } from '../datepicker/datepicker.module';
import { DroppableModule } from '../droppable/droppable.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { InputComponent } from './components/input/input.component';

@NgModule({
  declarations: [InputComponent],
  imports: [SharedModule, DatepickerModule, DroppableModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [InputComponent]
})
export class InputModule {}
