import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { DropdownModule } from '../dropdown/dropdown.module';
import { DroppableModule } from '../droppable/droppable.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { SelectComponent } from './components/select/select.component';

@NgModule({
  declarations: [SelectComponent],
  imports: [SharedModule, DropdownModule, DroppableModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [SelectComponent]
})
export class SelectModule {}
