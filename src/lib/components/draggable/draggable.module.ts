import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { DraggableComponent } from './components/draggable/draggable.component';
import { DraggerComponent } from './components/dragger/dragger.component';

@NgModule({
  declarations: [DraggableComponent, DraggerComponent],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DraggableComponent, DraggerComponent]
})
export class DraggableModule {}
