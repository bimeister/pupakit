import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ComponentsModule } from '../../../src/public-api';
import { AdaptiveDemoRoutingModule } from './adaptive-demo-routing.module';
import { AdaptiveDemoComponent } from './adaptive-demo.component';
import { AdaptiveExample1Component } from './examples/example-1/example-1.component';

const COMPONENTS: Type<unknown>[] = [AdaptiveDemoComponent, AdaptiveExample1Component];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [AdaptiveDemoRoutingModule, CommonModule, ComponentsModule]
})
export class AdaptiveDemoModule {}
