import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { TreeDemoRoutingModule } from './tree-demo-routing.module';
import { TreeDemoComponent } from './tree-demo.component';

@NgModule({
  declarations: [TreeDemoComponent],
  imports: [DemoSharedModule, TreeDemoRoutingModule],
})
export class TreeDemoModule {}
