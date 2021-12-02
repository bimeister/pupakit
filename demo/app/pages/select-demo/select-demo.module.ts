import { NgModule, Type } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { SelectDemoComponent } from './select-demo.component';
import { SelectDemoRoutingModule } from './select-demo-routing.module';
import { SelectExample1Component } from './examples/example-1/example-1.component';

const EXAMPLES: Type<unknown>[] = [SelectExample1Component];
const COMPONENTS: Type<unknown>[] = [SelectDemoComponent, ...EXAMPLES];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [DemoSharedModule, SelectDemoRoutingModule],
})
export class SelectDemoModule {}
