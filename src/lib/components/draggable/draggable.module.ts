import { NgModule } from '@angular/core';

import { SharedModule } from './../../../internal/shared/shared.module';
import { DraggableComponent } from './components/draggable/draggable.component';
import { DraggerComponent } from './components/dragger/dragger.component';

@NgModule({
  declarations: [DraggableComponent, DraggerComponent],
  imports: [SharedModule],
  exports: [DraggableComponent, DraggerComponent]
})
export class DraggableModule {}
