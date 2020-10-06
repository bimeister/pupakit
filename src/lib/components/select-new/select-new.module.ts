import { OverlayModule } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '../../../internal/shared/shared.module';
import { TreeModule } from '../tree/tree.module';
import { SelectNewButtonComponent } from './components/regular/select-new-button/select-new-button.component';
import { SelectNewDropdownComponent } from './components/regular/select-new-dropdown/select-new-dropdown.component';
import { SelectNewItemComponent } from './components/regular/select-new-item/select-new-item.component';
import { SelectNewItemsContainerComponent } from './components/regular/select-new-items-container/select-new-items-container.component';
import { SelectNewSearchComponent } from './components/regular/select-new-search/select-new-search.component';
import { SelectNewTreeComponent } from './components/regular/select-new-tree/select-new-tree.component';
import { SelectNewComponent } from './components/regular/select-new/select-new.component';
import { SelectNewTableButtonComponent } from './components/table/select-new-table-button/select-new-table-button.component';
import { SelectNewTableDropdownComponent } from './components/table/select-new-table-dropdown/select-new-table-dropdown.component';
import { SelectNewTableItemComponent } from './components/table/select-new-table-item/select-new-table-item.component';
import { SelectNewTableItemsContainerComponent } from './components/table/select-new-table-items-container/select-new-table-items-container.component';
import { SelectNewTableItemsSearchComponent } from './components/table/select-new-table-items-search/select-new-table-items-search.component';
import { SelectNewTableItemsTreeComponent } from './components/table/select-new-table-items-tree/select-new-table-items-tree.component';
import { SelectNewTableComponent } from './components/table/select-new-table/select-new-table.component';

const COMPONENTS: any[] = [
  SelectNewComponent,
  SelectNewSearchComponent,
  SelectNewItemComponent,
  SelectNewItemsContainerComponent,
  SelectNewTreeComponent,
  SelectNewButtonComponent,
  SelectNewDropdownComponent,
  SelectNewTableComponent,
  SelectNewTableButtonComponent,
  SelectNewTableDropdownComponent,
  SelectNewTableItemComponent,
  SelectNewTableItemsContainerComponent,
  SelectNewTableItemsSearchComponent,
  SelectNewTableItemsTreeComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [SharedModule, OverlayModule, TreeModule],
  exports: [...COMPONENTS],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectNewModule {}
