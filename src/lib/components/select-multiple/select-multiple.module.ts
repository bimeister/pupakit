import { NgModule } from '@angular/core';

import { SharedModule } from '../../../internal/shared/shared.module';
import { ChipButtonModule } from '../chip-button/chip-button.module';
import { ChipModule } from '../chip/chip.module';
import { DroppableModule } from '../droppable/droppable.module';
import { MultiselectionListModule } from '../multiselection-list/multiselection-list.module';
import { SelectMultipleComponent } from './components/select-multiple/select-multiple.component';
import { IconModule } from '../icon/icon.module';
import { mdCloseIcon } from '../../../internal/constants/icons/md-close-icon.const';
import { mdArrowDropdownIcon } from '../../../internal/constants/icons/md-arrow-dropdown-icon.const';
import { mdCheckmarkCircleIcon } from '../../../internal/constants/icons/md-checkmark-circle-icon.const';

@NgModule({
  declarations: [SelectMultipleComponent],
  imports: [
    SharedModule,
    DroppableModule,
    MultiselectionListModule,
    ChipButtonModule,
    ChipModule,
    IconModule.forFeature([mdCloseIcon, mdArrowDropdownIcon, mdCheckmarkCircleIcon])
  ],
  exports: [SelectMultipleComponent]
})
export class SelectMultipleModule {}
