import { NgModule, Type } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { StatusExample1Component } from './examples/example-1/example-1.component';
import { StatusExample2Component } from './examples/example-2/example-2.component';
import { StatusDemoRoutingModule } from './status-demo-routing.module';
import { StatusDemoComponent } from './status-demo.component';
import { StatusExample3Component } from './examples/example-3/example-3.component';
import { StatusExample4Component } from './examples/example-4/example-4.component';

const EXAMPLES: Type<unknown>[] = [
  StatusExample1Component,
  StatusExample2Component,
  StatusExample3Component,
  StatusExample4Component,
];
const COMPONENTS: Type<unknown>[] = [StatusDemoComponent, ...EXAMPLES];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [DemoSharedModule, StatusDemoRoutingModule],
})
export class StatusDemoModule {}
