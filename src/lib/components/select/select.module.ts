import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { iosArrowDownIcon } from '../../../internal/constants/icons/ios-arrow-down-icon.const';
import { mdArrowDropdownIcon } from '../../../internal/constants/icons/md-arrow-dropdown-icon.const';
import { mdCloseCircleIcon } from '../../../internal/constants/icons/md-close-circle-icon.const';
import { mdCloseIcon } from '../../../internal/constants/icons/md-close-icon.const';
import { SharedModule } from '../../../internal/shared/shared.module';
import { ButtonModule } from '../button/button.module';
import { CheckboxModule } from '../checkbox/checkbox.module';
import { ChipModule } from '../chip/chip.module';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { IconModule } from '../icon/icon.module';
import { TooltipModule } from '../tooltip/tooltip.module';
import { TreeModule } from '../tree/tree.module';
import { SelectButtonInputComponent } from './components/select-button-input/select-button-input.component';
import { SelectButtonComponent } from './components/select-button/select-button.component';
import { SelectChipButtonComponent } from './components/select-chip-button/select-chip-button.component';
import { SelectChipItemComponent } from './components/select-chip-item/select-chip-item.component';
import { SelectChipsContainerComponent } from './components/select-chips-container/select-chips-container.component';
import { SelectDropdownComponent } from './components/select-dropdown/select-dropdown.component';
import { SelectIconButtonComponent } from './components/select-icon-button/select-icon-button.component';
import { SelectItemCheckboxComponent } from './components/select-item-checkbox/select-item-checkbox.component';
import { SelectItemComponent } from './components/select-item/select-item.component';
import { SelectItemsContainerComponent } from './components/select-items-container/select-items-container.component';
import { SelectSearchComponent } from './components/select-search/select-search.component';
import { SelectTabsItemComponent } from './components/select-tabs-item/select-tabs-item.component';
import { SelectTabsComponent } from './components/select-tabs/select-tabs.component';
import { SelectTreeComponent } from './components/select-tree/select-tree.component';
import { SelectComponent } from './components/select/select.component';

const COMPONENTS: any[] = [
  SelectComponent,
  SelectSearchComponent,
  SelectItemComponent,
  SelectItemCheckboxComponent,
  SelectItemsContainerComponent,
  SelectTreeComponent,
  SelectButtonComponent,
  SelectIconButtonComponent,
  SelectChipButtonComponent,
  SelectDropdownComponent,

  SelectChipItemComponent,
  SelectTabsComponent,
  SelectTabsItemComponent,
  SelectButtonInputComponent,
  SelectChipsContainerComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    SharedModule,
    OverlayModule,
    TreeModule,
    TooltipModule,
    ChipModule,
    CheckboxModule,
    IconButtonModule,
    ButtonModule,
    IconModule.forFeature([mdArrowDropdownIcon, mdCloseCircleIcon, iosArrowDownIcon, mdCloseIcon, iosArrowDownIcon]),
  ],
  exports: [...COMPONENTS],
})
export class SelectModule {}
