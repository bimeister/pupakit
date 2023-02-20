import { NgModule } from '@angular/core';
import { AccordionDemoExample1Component } from './examples/example-1/example-1.component';
import { AccordionDemoExample2Component } from './examples/example-2/example-2.component';
import { AccordionDemoExample3Component } from './examples/example-3/example-3.component';
import { AccordionDemoExample4Component } from './examples/example-4/example-4.component';
import { AccordionDemoExample5Component } from './examples/example-5/example-5.component';
import { AccordionDemoExample6Component } from './examples/example-6/example-6.component';
import { AccordionDemoExample7Component } from './examples/example-7/example-7.component';
import { DemoSharedModule } from '../../shared/shared.module';
import { AccordionDemoRoutingModule } from './accordion-demo-routing.module';
import { AccordionDemoComponent } from './accordion-demo.component';

@NgModule({
  declarations: [
    AccordionDemoComponent,
    AccordionDemoExample1Component,
    AccordionDemoExample2Component,
    AccordionDemoExample3Component,
    AccordionDemoExample4Component,
    AccordionDemoExample5Component,
    AccordionDemoExample6Component,
    AccordionDemoExample7Component,
  ],
  imports: [DemoSharedModule, AccordionDemoRoutingModule],
})
export class AccordionDemoModule {}
