import { NgModule, Type } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { BadgeDemoRoutingModule } from './badge-demo-routing.module';
import { BadgeDemoComponent } from './badge-demo.component';
import { BadgeExample1Component } from './examples/example-1/example-1.component';
import { BadgeExample2Component } from './examples/example-2/example-2.component';
import { BadgeExample3Component } from './examples/example-3/example-3.component';
import { BadgeExample4Component } from './examples/example-4/example-4.component';

const EXAMPLES: Type<unknown>[] = [
  BadgeExample1Component,
  BadgeExample2Component,
  BadgeExample3Component,
  BadgeExample4Component,
];
const COMPONENTS: Type<unknown>[] = [BadgeDemoComponent, ...EXAMPLES];
const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [DemoSharedModule, BadgeDemoRoutingModule],
})
export class BadgeDemoModule {}
