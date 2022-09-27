import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { TreeNewDemoRoutingModule } from './tree-new-demo-routing.module';
import { TreeNewDemoComponent } from './tree-new-demo.component';
import { TreeNewExample1Component } from './examples/example-1/tree-new-example-1.component';
import { TreeNewExample2Component } from './examples/example-2/tree-new-example-2.component';
import { TreeNewExample3Component } from './examples/example-3/tree-new-example-3.component';
import { DirectivesModule } from '@kit/internal/directives/directives.module';
import { TreeNewExample4Component } from './examples/example-4/tree-new-example-4.component';
import { TreeNewExample5Component } from './examples/example-5/tree-new-example-5.component';
import { TreeNewExample6Component } from './examples/example-6/tree-new-example-6.component';
import { TreeNewExample7Component } from './examples/example-7/tree-new-example-7.component';
import { TreeNewExample8Component } from './examples/example-8/tree-new-example-8.component';

@NgModule({
  declarations: [
    TreeNewDemoComponent,
    TreeNewExample1Component,
    TreeNewExample2Component,
    TreeNewExample3Component,
    TreeNewExample4Component,
    TreeNewExample5Component,
    TreeNewExample6Component,
    TreeNewExample7Component,
    TreeNewExample8Component,
  ],
  imports: [DemoSharedModule, TreeNewDemoRoutingModule, DirectivesModule],
})
export class TreeNewDemoModule {}
