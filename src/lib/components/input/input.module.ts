import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { ChipSelectModule } from '../chip-select/chip-select.module';
import { DatepickerModule } from '../datepicker/datepicker.module';
import { DroppableModule } from '../droppable/droppable.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { InputComponent } from './components/input/input.component';

@NgModule({
  declarations: [InputComponent],
  imports: [SharedModule, ChipSelectModule, DatepickerModule, DroppableModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [InputComponent]
})
export class InputModule {}
