import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ComponentsModule } from '../../../../src/public-api';
import { DemoSharedModule } from '../../shared/shared.module';
import { BreadcrumbsDemoRoutingModule } from './breadcrumbs-demo-routing.module';
import { BreadcrumbsDemoComponent } from './breadcrumbs-demo.component';
import { BreadcrumbsExample1Component } from './examples/example-1/example-1.component';
import { BreadcrumbsExample2Component } from './examples/example-2/example-2.component';
import { BreadcrumbsExample3Component } from './examples/example-3/example-3.component';

const EXAMPLES: Type<unknown>[] = [
  BreadcrumbsExample1Component,
  BreadcrumbsExample2Component,
  BreadcrumbsExample3Component,
];
const COMPONENTS: Type<unknown>[] = [BreadcrumbsDemoComponent, ...EXAMPLES];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [BreadcrumbsDemoRoutingModule, CommonModule, ComponentsModule, DemoSharedModule],
})
export class BreadcrumbsDemoModule {}
