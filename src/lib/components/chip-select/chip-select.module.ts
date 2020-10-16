import { NgModule } from '@angular/core';

import { ChipModule } from '../chip/chip.module';
import { InputModule } from '../input/input.module';
import { SharedModule } from './../../../internal/shared/shared.module';
import { ChipButtonModule } from './../chip-button/chip-button.module';
import { DroppableModule } from './../droppable/droppable.module';
import { ChipSelectTreeNodeComponent } from './components/chip-select-tree-node/chip-select-tree-node.component';
import { ChipSelectTreeComponent } from './components/chip-select-tree/chip-select-tree.component';
import { ChipSelectComponent } from './components/chip-select/chip-select.component';
import { IconModule } from '../icon/icon.module';
import { mdAddIcon } from '../../../internal/constants/icons/md-add-icon.const';
import { mdTrashIcon } from '../../../internal/constants/icons/md-trash-icon.const';
import { mdArrowDropupIcon } from '../../../internal/constants/icons/md-arrow-dropup-icon.const';
import { mdArrowDropdownIcon } from '../../../internal/constants/icons/md-arrow-dropdown-icon.const';

@NgModule({
  declarations: [ChipSelectComponent, ChipSelectTreeComponent, ChipSelectTreeNodeComponent],
  imports: [
    SharedModule,
    DroppableModule,
    ChipButtonModule,
    ChipModule,
    InputModule,
    IconModule.forFeature([mdAddIcon, mdTrashIcon, mdArrowDropupIcon, mdArrowDropdownIcon])
  ],
  exports: [ChipSelectComponent, ChipSelectTreeComponent]
})
export class ChipSelectModule {}
