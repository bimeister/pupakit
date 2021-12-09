import { NgModule, Type } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { SelectExample12Component } from './examples/select-demo-extra-cases/example-12/example-12.component';
import { SelectExample13Component } from './examples/select-demo-extra-cases/example-13/example-13.component';
import { SelectExample10Component } from './examples/select-demo-multi-selection/example-10/example-10.component';
import { SelectExample8Component } from './examples/select-demo-multi-selection/example-8/example-8.component';
import { SelectExample9Component } from './examples/select-demo-multi-selection/example-9/example-9.component';
import { SelectExample1Component } from './examples/select-demo-one-selection/example-1/example-1.component';
import { SelectExample2Component } from './examples/select-demo-one-selection/example-2/example-2.component';
import { SelectExample3Component } from './examples/select-demo-one-selection/example-3/example-3.component';
import { SelectExample4Component } from './examples/select-demo-one-selection/example-4/example-4.component';
import { SelectExample5Component } from './examples/select-demo-one-selection/example-5/example-5.component';
import { SelectExample6Component } from './examples/select-demo-one-selection/example-6/example-6.component';
import { SelectExample7Component } from './examples/select-demo-one-selection/example-7/example-7.component';
import { SelectExample11Component } from './examples/select-demo-structure-composition/example-11/example-11.component';
import { SelectExample14Component } from './examples/select-demo-tree/example-14/example-14.component';
import { SelectExample15Component } from './examples/select-demo-tree/example-15/example-15.component';
import { SelectDemoRoutingModule } from './select-demo-routing.module';
import { SelectDemoComponent } from './select-demo.component';

const EXAMPLES: Type<unknown>[] = [
  SelectExample1Component,
  SelectExample2Component,
  SelectExample3Component,
  SelectExample4Component,
  SelectExample5Component,
  SelectExample6Component,
  SelectExample7Component,
  SelectExample8Component,
  SelectExample9Component,
  SelectExample10Component,
  SelectExample11Component,
  SelectExample12Component,
  SelectExample13Component,
  SelectExample14Component,
  SelectExample15Component
];
const COMPONENTS: Type<unknown>[] = [SelectDemoComponent, ...EXAMPLES];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [DemoSharedModule, SelectDemoRoutingModule],
})
export class SelectDemoModule {}
