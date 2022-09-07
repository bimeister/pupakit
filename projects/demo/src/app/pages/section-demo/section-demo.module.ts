import { NgModule, Type } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { SectionDemoRoutingModule } from './section-demo-routing.module';
import { SectionDemoComponent } from './section-demo.component';
import { SectionExample1Component } from './examples/example-1/example-1.component';
import { SectionExample2Component } from './examples/example-2/example-2.component';
import { SectionExample3Component } from './examples/example-3/example-3.component';

const EXAMPLES: Type<unknown>[] = [SectionExample1Component, SectionExample2Component, SectionExample3Component];

@NgModule({
  declarations: [SectionDemoComponent, ...EXAMPLES],
  imports: [DemoSharedModule, SectionDemoRoutingModule],
})
export class SectionDemoModule {}
