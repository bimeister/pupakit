import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from '../../../internal/shared/shared.module';
import { DraggableListItemComponent } from './components/draggable-list-item/draggable-list-item.component';
import { DraggableListComponent } from './components/draggable-list/draggable-list.component';

@NgModule({
  declarations: [DraggableListComponent, DraggableListItemComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DraggableListComponent, DraggableListItemComponent]
})
export class DraggableListModule {}
