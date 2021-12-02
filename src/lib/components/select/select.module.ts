import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { iosArrowDownIcon } from '../../../internal/constants/icons/ios-arrow-down-icon.const';
import { mdArrowDropdownIcon } from '../../../internal/constants/icons/md-arrow-dropdown-icon.const';
import { mdCloseCircleIcon } from '../../../internal/constants/icons/md-close-circle-icon.const';
import { mdCloseIcon } from '../../../internal/constants/icons/md-close-icon.const';
import { SharedModule } from '../../../internal/shared/shared.module';
import { CheckboxModule } from '../checkbox/checkbox.module';
import { ChipModule } from '../chip/chip.module';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { IconModule } from '../icon/icon.module';
import { TooltipModule } from '../tooltip/tooltip.module';
import { TreeModule } from '../tree/tree.module';
import { SelectButtonInputComponent } from './components/regular/select-button-input/select-button-input.component';
import { SelectButtonComponent } from './components/regular/select-button/select-button.component';
import { SelectChipButtonComponent } from './components/regular/select-chip-button/select-chip-button.component';
import { SelectChipItemComponent } from './components/regular/select-chip-item/select-chip-item.component';
import { SelectChipsContainerComponent } from './components/regular/select-chips-container/select-chips-container.component';
import { SelectDropdownComponent } from './components/regular/select-dropdown/select-dropdown.component';
import { SelectIconButtonComponent } from './components/regular/select-icon-button/select-icon-button.component';
import { SelectItemCheckboxComponent } from './components/regular/select-item-checkbox/select-item-checkbox.component';
import { SelectItemComponent } from './components/regular/select-item/select-item.component';
import { SelectItemsContainerComponent } from './components/regular/select-items-container/select-items-container.component';
import { SelectSearchComponent } from './components/regular/select-search/select-search.component';
import { SelectTabsItemComponent } from './components/regular/select-tabs-item/select-tabs-item.component';
import { SelectTabsComponent } from './components/regular/select-tabs/select-tabs.component';
import { SelectTreeComponent } from './components/regular/select-tree/select-tree.component';
import { SelectComponent } from './components/regular/select/select.component';
import { SelectTableButtonComponent } from './components/table/select-table-button/select-table-button.component';
import { SelectTableDropdownComponent } from './components/table/select-table-dropdown/select-table-dropdown.component';
import { SelectTableItemComponent } from './components/table/select-table-item/select-table-item.component';
import { SelectTableItemsContainerComponent } from './components/table/select-table-items-container/select-table-items-container.component';
import { SelectTableSearchComponent } from './components/table/select-table-search/select-table-search.component';
import { SelectTableTreeComponent } from './components/table/select-table-tree/select-table-tree.component';
import { SelectTableComponent } from './components/table/select-table/select-table.component';

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
  SelectTableComponent,
  SelectTableButtonComponent,
  SelectTableDropdownComponent,
  SelectTableItemComponent,
  SelectTableItemsContainerComponent,
  SelectTableSearchComponent,
  SelectTableTreeComponent,
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
    IconModule.forFeature([mdArrowDropdownIcon, mdCloseCircleIcon, iosArrowDownIcon, mdCloseIcon, iosArrowDownIcon]),
  ],
  exports: [...COMPONENTS],
})
export class SelectModule {}
