import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ComponentsModule } from '../../../../../src/public-api';
import { DemoSharedModule } from '../../shared/shared.module';
import { AdaptiveDemoRoutingModule } from './adaptive-demo-routing.module';
import { AdaptiveDemoComponent } from './adaptive-demo.component';
import { AdaptiveExample1Component } from './examples/example-1/example-1.component';
import { AdaptiveExample2Component } from './examples/example-2/example-2.component';
import { AdaptiveExample3Component } from './examples/example-3/example-3.component';
import { AdaptiveExample4Component } from './examples/example-4/example-4.component';
import { AdaptiveExample5Component } from './examples/example-5/example-5.component';
import { AdaptiveExample6Component } from './examples/example-6/example-6.component';
import { AdaptiveExample7Component } from './examples/example-7/example-7.component';
import { AdaptiveExample8Component } from './examples/example-8/example-8.component';
import { AdaptiveExample9Component } from './examples/example-9/example-9.component';

const EXAMPLES: Type<unknown>[] = [
  AdaptiveExample1Component,
  AdaptiveExample2Component,
  AdaptiveExample3Component,
  AdaptiveExample4Component,
  AdaptiveExample5Component,
  AdaptiveExample6Component,
  AdaptiveExample7Component,
  AdaptiveExample8Component,
  AdaptiveExample9Component,
];
const COMPONENTS: Type<unknown>[] = [AdaptiveDemoComponent, ...EXAMPLES];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [AdaptiveDemoRoutingModule, CommonModule, ComponentsModule, DemoSharedModule],
})
export class AdaptiveDemoModule {}
