import { NgModule, Type } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { CounterDemoRoutingModule } from './counter-demo-routing.module';
import { CounterDemoComponent } from './counter-demo.component';
import { CounterExample1Component } from './examples/example-1/example-1.component';
import { CounterExample2Component } from './examples/example-2/example-2.component';

const EXAMPLES: Type<unknown>[] = [CounterExample1Component, CounterExample2Component];
const COMPONENTS: Type<unknown>[] = [CounterDemoComponent, ...EXAMPLES];
const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [DemoSharedModule, CounterDemoRoutingModule],
})
export class CounterDemoModule {}
