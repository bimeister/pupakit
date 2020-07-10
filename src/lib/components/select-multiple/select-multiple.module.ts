import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '../../../internal/shared/shared.module';
import { ChipButtonModule } from '../chip-button/chip-button.module';
import { ChipModule } from '../chip/chip.module';
import { DroppableModule } from '../droppable/droppable.module';
import { MultiselectionListModule } from '../multiselection-list/multiselection-list.module';
import { SelectMultipleComponent } from './components/select-multiple/select-multiple.component';

@NgModule({
  declarations: [SelectMultipleComponent],
  imports: [SharedModule, DroppableModule, MultiselectionListModule, ChipButtonModule, ChipModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [SelectMultipleComponent]
})
export class SelectMultipleModule {}
