import { NgModule } from '@angular/core';

import { SharedModule } from '../../../internal/shared/shared.module';
import { DraggableListItemComponent } from './components/draggable-list-item/draggable-list-item.component';
import { DraggableListComponent } from './components/draggable-list/draggable-list.component';

@NgModule({
  declarations: [DraggableListComponent, DraggableListItemComponent],
  imports: [SharedModule],
  exports: [DraggableListComponent, DraggableListItemComponent]
})
export class DraggableListModule {}
