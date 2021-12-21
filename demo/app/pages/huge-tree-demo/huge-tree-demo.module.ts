import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { HugeTreeDemoRoutingModule } from './huge-tree-demo-routing.module';
import { HugeTreeDemoComponent } from './huge-tree-demo.component';

@NgModule({
  declarations: [HugeTreeDemoComponent],
  imports: [DemoSharedModule, HugeTreeDemoRoutingModule]
})
export class HugeTreeDemoModule {}
