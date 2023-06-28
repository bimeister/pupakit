import { NgModule } from '@angular/core';
import { FlexPanelDemoRoutingModule } from './flex-panel-demo-routing.module';
import { FlexPanelDemoComponent } from './flex-panel-demo.component';
import { FlexPanelDemoExample1Component } from './examples/example-1/example-1.component';
import { DemoSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [FlexPanelDemoComponent, FlexPanelDemoExample1Component],
  imports: [DemoSharedModule, FlexPanelDemoRoutingModule],
})
export class FlexPanelDemoModule {}
