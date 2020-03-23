import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { InputModule } from '../input/input.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { ChipButtonModule } from './../chip-button/chip-button.module';
import { DroppableModule } from './../droppable/droppable.module';
import { ChipSelectTreeNodeComponent } from './components/chip-select-tree-node/chip-select-tree-node.component';
import { ChipSelectTreeComponent } from './components/chip-select-tree/chip-select-tree.component';
import { ChipSelectComponent } from './components/chip-select/chip-select.component';

@NgModule({
  declarations: [ChipSelectComponent, ChipSelectTreeComponent, ChipSelectTreeNodeComponent],
  imports: [SharedModule, DroppableModule, ChipButtonModule, InputModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [ChipSelectComponent, ChipSelectTreeComponent]
})
export class ChipSelectModule {}
