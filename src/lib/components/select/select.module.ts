import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { iosArrowDownIcon } from '../../../internal/constants/icons/ios-arrow-down-icon.const';
import { mdArrowDropdownIcon } from '../../../internal/constants/icons/md-arrow-dropdown-icon.const';
import { mdCloseCircleIcon } from '../../../internal/constants/icons/md-close-circle-icon.const';
import { mdCloseIcon } from '../../../internal/constants/icons/md-close-icon.const';
import { SharedModule } from '../../../internal/shared/shared.module';
import { CheckboxModule } from '../checkbox/checkbox.module';
import { ChipButtonModule } from '../chip-button/chip-button.module';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { IconModule } from '../icon/icon.module';
import { TreeModule } from '../tree/tree.module';
import { SelectButtonItemComponent } from './components/regular/select-button-item/select-button-item.component';
import { SelectButtonComponent } from './components/regular/select-button/select-button.component';
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
  SelectDropdownComponent,
  SelectTableComponent,
  SelectTableButtonComponent,
  SelectTableDropdownComponent,
  SelectTableItemComponent,
  SelectTableItemsContainerComponent,
  SelectTableSearchComponent,
  SelectTableTreeComponent,
  SelectButtonItemComponent,
  SelectTabsComponent,
  SelectTabsItemComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    SharedModule,
    OverlayModule,
    TreeModule,
    ChipButtonModule,
    CheckboxModule,
    IconButtonModule,
    IconModule.forFeature([mdArrowDropdownIcon, mdCloseCircleIcon, iosArrowDownIcon, mdCloseIcon])
  ],
  exports: [...COMPONENTS]
})
export class SelectModule {}
