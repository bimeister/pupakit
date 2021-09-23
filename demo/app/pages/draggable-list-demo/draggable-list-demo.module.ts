import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { DraggableListDemoRoutingModule } from './draggable-list-demo-routing.module';
import { DraggableListDemoComponent } from './draggable-demo.component';

@NgModule({
  declarations: [DraggableListDemoComponent],
  imports: [DemoSharedModule, DraggableListDemoRoutingModule]
})
export class DraggableListDemoModule {}
