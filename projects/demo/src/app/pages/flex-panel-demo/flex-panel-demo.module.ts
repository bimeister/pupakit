import { NgModule } from '@angular/core';
import { FlexPanelDemoRoutingModule } from './flex-panel-demo-routing.module';
import { FlexPanelDemoComponent } from './flex-panel-demo.component';
import { FlexPanelDemoExample1Component } from './examples/example-1/example-1.component';
import { DemoSharedModule } from '../../shared/shared.module';
import { FlexPanelDemoExample3Component } from './examples/example-3/example-3.component';
import { FlexPanelDemoExample4Component } from './examples/example-4/example-4.component';
import { FlexPanelDemoExample2Component } from './examples/example-2/example-2.component';

@NgModule({
  declarations: [
    FlexPanelDemoComponent,
    FlexPanelDemoExample1Component,
    FlexPanelDemoExample2Component,
    FlexPanelDemoExample3Component,
    FlexPanelDemoExample4Component,
  ],
  imports: [DemoSharedModule, FlexPanelDemoRoutingModule],
})
export class FlexPanelDemoModule {}
