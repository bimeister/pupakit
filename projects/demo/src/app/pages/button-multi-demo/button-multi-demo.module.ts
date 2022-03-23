import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { ButtonMultiDemoRoutingModule } from './button-multi-demo-routing.module';
import { ButtonMultiDemoComponent } from './button-multi-demo.component';
import { ButtonMultiExample1Component } from './examples/example-1/example-1.component';
import { ButtonMultiExample2Component } from './examples/example-2/example-2.component';
import { ButtonMultiExample3Component } from './examples/example-3/example-3.component';
import { ButtonMultiExample4Component } from './examples/example-4/example-4.component';
import { ButtonMultiExample5Component } from './examples/example-5/example-5.component';
import { ButtonMultiExample6Component } from './examples/example-6/example-6.component';
import { ButtonMultiExample7Component } from './examples/example-7/example-7.component';

@NgModule({
  declarations: [
    ButtonMultiDemoComponent,
    ButtonMultiExample1Component,
    ButtonMultiExample2Component,
    ButtonMultiExample3Component,
    ButtonMultiExample4Component,
    ButtonMultiExample5Component,
    ButtonMultiExample6Component,
    ButtonMultiExample7Component,
  ],
  imports: [DemoSharedModule, ButtonMultiDemoRoutingModule],
})
export class ButtonMultiDemoModule {}
