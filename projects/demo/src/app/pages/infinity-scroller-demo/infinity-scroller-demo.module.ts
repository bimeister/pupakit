import { NgModule } from '@angular/core';
import { InfinityScrollerExample1Component } from './examples/example-1/example-1.component';
import { InfinityScrollerExample2Component } from './examples/example-2/example-2.component';
import { InfinityScrollerExample3Component } from './examples/example-3/example-3.component';
import { InfinityScrollerDemoRoutingModule } from './infinity-scroller-demo-routing.module';
import { InfinityScrollerDemoComponent } from './infinity-scroller-demo.component';
import { DemoSharedModule } from '../../shared/shared.module';
import { InfinityScrollerExample4Component } from './examples/example-4/example-4.component';

@NgModule({
  declarations: [
    InfinityScrollerDemoComponent,
    InfinityScrollerExample1Component,
    InfinityScrollerExample2Component,
    InfinityScrollerExample3Component,
    InfinityScrollerExample4Component,
  ],
  imports: [DemoSharedModule, InfinityScrollerDemoRoutingModule],
})
export class InfinityScrollerDemoModule {}
