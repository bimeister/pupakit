import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ComponentsModule } from '../../../../src/public-api';
import { DemoSharedModule } from '../../shared/shared.module';
import { CodeDemoRoutingModule } from './code-demo-routing.module';
import { CodeDemoComponent } from './code-demo.component';
import { CodeExample1Component } from './examples/example-1/example-1.component';
import { CodeExample2Component } from './examples/example-2/example-2.component';

const COMPONENTS: Type<unknown>[] = [CodeDemoComponent, CodeExample1Component, CodeExample2Component];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [CodeDemoRoutingModule, CommonModule, ComponentsModule, DemoSharedModule],
})
export class CodeDemoModule {}
