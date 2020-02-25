import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { DroppableComponent } from './components/droppable/droppable.component';

@NgModule({
  declarations: [DroppableComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DroppableComponent]
})
export class DroppableModule {}
