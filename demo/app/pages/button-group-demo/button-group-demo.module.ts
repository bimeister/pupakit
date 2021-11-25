import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { ButtonGroupDemoRoutingModule } from './button-group-demo-routing.module';
import { ButtonGroupDemoComponent } from './button-group-demo.component';
import { ButtonGroupExample1Component } from './examples/example-1/example-1.component';
import { ButtonGroupExample2Component } from './examples/example-2/example-2.component';
import { ButtonGroupExample3Component } from './examples/example-3/example-3.component';

@NgModule({
  declarations: [
    ButtonGroupDemoComponent,
    ButtonGroupExample1Component,
    ButtonGroupExample2Component,
    ButtonGroupExample3Component
  ],
  imports: [DemoSharedModule, ButtonGroupDemoRoutingModule]
})
export class ButtonGroupDemoModule {}
