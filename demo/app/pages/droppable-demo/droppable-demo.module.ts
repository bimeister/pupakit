import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { DroppableDemoRoutingModule } from './droppable-demo-routing.module';
import { DroppableDemoComponent } from './droppable-demo.component';

@NgModule({
  declarations: [DroppableDemoComponent],
  imports: [DemoSharedModule, DroppableDemoRoutingModule]
})
export class DroppableDemoModule {}
