import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { OptionExample1Component } from './examples/example-1/example-1.component';
import { OptionExample2Component } from './examples/example-2/example-2.component';
import { OptionExample3Component } from './examples/example-3/example-3.component';
import { OptionExample4Component } from './examples/example-4/example-4.component';
import { OptionExample5Component } from './examples/example-5/example-5.component';
import { OptionExample6Component } from './examples/example-6/example-6.component';
import { OptionExample7Component } from './examples/example-7/example-7.component';
import { OptionDemoRoutingModule } from './option-demo-routing.module';
import { OptionDemoComponent } from './option-demo.component';

@NgModule({
  declarations: [
    OptionDemoComponent,
    OptionExample1Component,
    OptionExample2Component,
    OptionExample3Component,
    OptionExample4Component,
    OptionExample5Component,
    OptionExample6Component,
    OptionExample7Component,
  ],
  imports: [DemoSharedModule, OptionDemoRoutingModule],
})
export class OptionDemoModule {}
