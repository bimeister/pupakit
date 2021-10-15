import { NgModule, Type } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { StatusExample1Component } from './examples/example-1/example-1.component';
import { StatusExample2Component } from './examples/example-2/example-2.component';
import { StatusDemoRoutingModule } from './status-demo-routing.module';
import { StatusDemoComponent } from './status-demo.component';

const EXAMPLES: Type<unknown>[] = [StatusExample1Component, StatusExample2Component];
const COMPONENTS: Type<unknown>[] = [StatusDemoComponent, ...EXAMPLES];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [DemoSharedModule, StatusDemoRoutingModule]
})
export class StatusDemoModule {}
