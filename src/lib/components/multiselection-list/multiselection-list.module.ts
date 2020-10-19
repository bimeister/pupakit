import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '../../../internal/shared/shared.module';
import { MultiselectionListItemComponent } from './components/multiselection-list-item/multiselection-list-item.component';
import { MultiselectionListComponent } from './components/multiselection-list/multiselection-list.component';

@NgModule({
  declarations: [MultiselectionListComponent, MultiselectionListItemComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [MultiselectionListComponent, MultiselectionListItemComponent]
})
export class MultiselectionListModule {}
