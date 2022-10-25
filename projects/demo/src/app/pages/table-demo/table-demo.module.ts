import { NgModule, Type } from '@angular/core';
import { PupaDirectivesModule } from '@bimeister/pupakit.common';
import { DemoSharedModule } from '../../shared/shared.module';
import { TableExample1Component } from './examples/example-1/example-1.component';
import { TableExample2Component } from './examples/example-2/example-2.component';
import { TableExample3Component } from './examples/example-3/example-3.component';
import { TableExample4Component } from './examples/example-4/example-4.component';
import { TableExample5Component } from './examples/example-5/example-5.component';
import { TableExample6Component } from './examples/example-6/example-6.component';
import { TableExample7Component } from './examples/example-7/example-7.component';
import { TableExample8Component } from './examples/example-8/example-8.component';
import { TableExample9Component } from './examples/example-9/example-9.component';
import { TableDemoRoutingModule } from './table-demo-routing.module';
import { TableDemoComponent } from './table-demo.component';

const EXAMPLE_COMPONENTS: Type<unknown>[] = [
  TableExample1Component,
  TableExample2Component,
  TableExample3Component,
  TableExample4Component,
  TableExample5Component,
  TableExample6Component,
  TableExample7Component,
  TableExample8Component,
  TableExample9Component,
];

@NgModule({
  declarations: [...EXAMPLE_COMPONENTS, TableDemoComponent],
  imports: [TableDemoRoutingModule, DemoSharedModule, PupaDirectivesModule],
})
export class TableDemoModule {}
