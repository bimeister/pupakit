import { OverlayModule } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

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
  SelectTableTreeComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [SharedModule, OverlayModule, TreeModule],
  exports: [...COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectModule {}
