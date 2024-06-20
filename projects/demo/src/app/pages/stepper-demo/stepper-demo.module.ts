import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { StepperExample1Component } from './examples/example-1/example-1.component';

import { StepperDemoRoutingModule } from './stepper-demo-routing.module';
import { StepperDemoComponent } from './stepper-demo.component';
import { StepperExample2Component } from './examples/example-2/example-2.component';
import { StepperExample3Component } from './examples/example-3/example-3.component';
import { StepperExample4Component } from './examples/example-4/example-4.component';
import { StepperExample5Component } from './examples/example-5/example-5.component';
import { StepperExample6Component } from './examples/example-6/example-6.component';

@NgModule({
  declarations: [
    StepperDemoComponent,
    StepperExample1Component,
    StepperExample2Component,
    StepperExample3Component,
    StepperExample4Component,
    StepperExample5Component,
    StepperExample6Component,
  ],
  imports: [DemoSharedModule, StepperDemoRoutingModule],
})
export class StepperDemoModule {}
