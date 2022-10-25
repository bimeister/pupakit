import { NgModule } from '@angular/core';
import { AccordionDemoExample1Component } from './examples/example-1/example-1.component';
import { AccordionDemoExample2Component } from './examples/example-2/example-2.component';
import { AccordionDemoExample3Component } from './examples/example-3/example-3.component';
import { AccordionDemoExample4Component } from './examples/example-4/example-4.component';
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
  ],
  imports: [DemoSharedModule, AccordionDemoRoutingModule],
})
export class AccordionDemoModule {}
