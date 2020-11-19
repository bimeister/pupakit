import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../../internal/shared/shared.module';
import { TreeModule } from '../tree/tree.module';
import { SelectButtonComponent } from './components/regular/select-button/select-button.component';
import { SelectDropdownComponent } from './components/regular/select-dropdown/select-dropdown.component';
import { SelectItemComponent } from './components/regular/select-item/select-item.component';
import { SelectItemsContainerComponent } from './components/regular/select-items-container/select-items-container.component';
import { SelectSearchComponent } from './components/regular/select-search/select-search.component';
import { SelectTreeComponent } from './components/regular/select-tree/select-tree.component';
import { SelectComponent } from './components/regular/select/select.component';
import { SelectTableButtonComponent } from './components/table/select-table-button/select-table-button.component';
import { SelectTableDropdownComponent } from './components/table/select-table-dropdown/select-table-dropdown.component';
import { SelectTableItemComponent } from './components/table/select-table-item/select-table-item.component';
import { SelectTableItemsContainerComponent } from './components/table/select-table-items-container/select-table-items-container.component';
import { SelectTableSearchComponent } from './components/table/select-table-search/select-table-search.component';
import { SelectTableTreeComponent } from './components/table/select-table-tree/select-table-tree.component';
import { SelectTableComponent } from './components/table/select-table/select-table.component';
import { IconModule } from '../icon/icon.module';
import { mdArrowDropdownIcon } from '../../../internal/constants/icons/md-arrow-dropdown-icon.const';
import { mdCloseCircleIcon } from '../../../internal/constants/icons/md-close-circle-icon.const';
import { iosArrowDownIcon } from '../../../internal/constants/icons/ios-arrow-down-icon.const';
import { SelectButtonItemComponent } from './components/regular/select-button-item/select-button-item.component';
import { ChipButtonModule } from '../chip-button/chip-button.module';
import { mdCloseIcon } from '../../../internal/constants/icons/md-close-icon.const';

const COMPONENTS: any[] = [
  SelectComponent,
  SelectSearchComponent,
  SelectItemComponent,
  SelectItemsContainerComponent,
  SelectTreeComponent,
  SelectButtonComponent,
  SelectDropdownComponent,
  SelectTableComponent,
  SelectTableButtonComponent,
  SelectTableDropdownComponent,
  SelectTableItemComponent,
  SelectTableItemsContainerComponent,
  SelectTableSearchComponent,
  SelectTableTreeComponent,
  SelectButtonItemComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    SharedModule,
    OverlayModule,
    TreeModule,
    ChipButtonModule,
    IconModule.forFeature([mdArrowDropdownIcon, mdCloseCircleIcon, iosArrowDownIcon, mdCloseIcon])
  ],
  exports: [...COMPONENTS]
})
export class SelectModule {}
