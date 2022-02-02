import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { ButtonMultiDemoRoutingModule } from './button-multi-demo-routing.module';
import { ButtonMultiDemoComponent } from './button-multi-demo.component';
import { ButtonMultiExample1Component } from './examples/example-1/example-1.component';

@NgModule({
  declarations: [ButtonMultiDemoComponent, ButtonMultiExample1Component],
  imports: [DemoSharedModule, ButtonMultiDemoRoutingModule],
})
export class ButtonMultiDemoModule {}
