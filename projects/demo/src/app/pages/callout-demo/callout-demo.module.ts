import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { CalloutExample1Component } from './examples/example-1/example-1.component';
import { CalloutDemoRoutingModule } from './callout-demo-routing.module';
import { CalloutDemoComponent } from './callout-demo.component';

@NgModule({
  declarations: [CalloutDemoComponent, CalloutExample1Component],
  imports: [DemoSharedModule, CalloutDemoRoutingModule],
})
export class CalloutDemoModule {}
