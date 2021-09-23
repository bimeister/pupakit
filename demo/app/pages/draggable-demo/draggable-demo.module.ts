import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { DraggableDemoRoutingModule } from './draggable-demo-routing.module';
import { DraggableDemoComponent } from './draggable-demo.component';

@NgModule({
  declarations: [DraggableDemoComponent],
  imports: [DemoSharedModule, DraggableDemoRoutingModule]
})
export class DraggableDemoModule {}
