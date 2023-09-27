import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { RadioButtonExample1Component } from './examples/example-1/example-1.component';
import { RadioButtonExample2Component } from './examples/example-2/example-2.component';
import { RadioButtonExample3Component } from './examples/example-3/example-3.component';
import { RadioButtonExample4Component } from './examples/example-4/example-4.component';
import { RadioButtonExample5Component } from './examples/example-5/example-5.component';
import { RadioButtonDemoRoutingModule } from './radio-button-demo-routing.module';
import { RadioButtonDemoComponent } from './radio-button-demo.component';
import { RadioButtonExample6Component } from './examples/example-6/example-6.component';

@NgModule({
  declarations: [
    RadioButtonDemoComponent,
    RadioButtonExample1Component,
    RadioButtonExample2Component,
    RadioButtonExample3Component,
    RadioButtonExample4Component,
    RadioButtonExample5Component,
    RadioButtonExample6Component,
  ],
  imports: [DemoSharedModule, RadioButtonDemoRoutingModule],
})
export class RadioButtonDemoModule {}
