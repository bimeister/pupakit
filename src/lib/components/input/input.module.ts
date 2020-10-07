import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { DatepickerModule } from '../datepicker/datepicker.module';
import { DroppableModule } from '../droppable/droppable.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { InputPasswordComponent } from './components/input-password/input-password.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { InputComponent } from './components/input/input.component';

const EXPORTS: any[] = [InputComponent, InputTextComponent, InputPasswordComponent];

const DECLARATIONS: any[] = [...EXPORTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [SharedModule, DatepickerModule, DroppableModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...EXPORTS]
})
export class InputModule {}
