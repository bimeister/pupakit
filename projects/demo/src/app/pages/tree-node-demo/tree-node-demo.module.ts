import { NgModule } from '@angular/core';

import { TreeNodeDemoRoutingModule } from './tree-node-demo-routing.module';
import { TreeNodeDemoComponent } from './tree-node-demo.component';
import { TreeNodeDemoExample1Component } from './examples/example-1/example-1.component';
import { TreeNodeDemoExample2Component } from './examples/example-2/example-2.component';
import { DemoSharedModule } from '../../shared/shared.module';
import { TreeNodeDemoExample3Component } from './examples/example-3/example-3.component';
import { TreeNodeDemoExample4Component } from './examples/example-4/example-4.component';

@NgModule({
  declarations: [
    TreeNodeDemoComponent,
    TreeNodeDemoExample1Component,
    TreeNodeDemoExample2Component,
    TreeNodeDemoExample3Component,
    TreeNodeDemoExample4Component,
  ],
  imports: [DemoSharedModule, TreeNodeDemoRoutingModule],
})
export class TreeNodeDemoModule {}
