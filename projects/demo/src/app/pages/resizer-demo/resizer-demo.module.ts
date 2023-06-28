import { NgModule } from '@angular/core';
import { ResizerDemoRoutingModule } from './resizer-demo-routing.module';
import { ResizerDemoComponent } from './resizer-demo.component';
import { ResizerDemoExample1Component } from './examples/example-1/example-1.component';
import { DemoSharedModule } from '../../shared/shared.module';
import { ResizerDemoExample3Component } from './examples/example-3/example-3.component';
import { ResizerDemoExample4Component } from './examples/example-4/example-4.component';
import { ResizerDemoExample2Component } from './examples/example-2/example-2.component';
import { ResizerComponent } from './components/resizer/resizer.component';

@NgModule({
  declarations: [
    ResizerDemoComponent,
    ResizerComponent,
    ResizerDemoExample1Component,
    ResizerDemoExample2Component,
    ResizerDemoExample3Component,
    ResizerDemoExample4Component,
  ],
  imports: [DemoSharedModule, ResizerDemoRoutingModule],
})
export class ResizerDemoModule {}
