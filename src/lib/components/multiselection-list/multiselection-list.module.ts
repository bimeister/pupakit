import { NgModule } from '@angular/core';

import { SharedModule } from '../../../internal/shared/shared.module';
import { MultiselectionListItemComponent } from './components/multiselection-list-item/multiselection-list-item.component';
import { MultiselectionListComponent } from './components/multiselection-list/multiselection-list.component';

@NgModule({
  declarations: [MultiselectionListComponent, MultiselectionListItemComponent],
  imports: [SharedModule],
  exports: [MultiselectionListComponent, MultiselectionListItemComponent]
})
export class MultiselectionListModule {}
