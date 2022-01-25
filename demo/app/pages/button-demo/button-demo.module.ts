import { NgModule, Type } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { ButtonDemoRoutingModule } from './button-demo-routing.module';
import { ButtonDemoComponent } from './button-demo.component';
import { ButtonExample1Component } from './examples/example-1/example-1.component';
import { ButtonExample2Component } from './examples/example-2/example-2.component';
import { ButtonExample3Component } from './examples/example-3/example-3.component';
import { ButtonExample4Component } from './examples/example-4/example-4.component';
import { ButtonExample5Component } from './examples/example-5/example-5.component';

const EXAMPLES: Type<unknown>[] = [
  ButtonExample1Component,
  ButtonExample2Component,
  ButtonExample3Component,
  ButtonExample4Component,
  ButtonExample5Component,
];
const COMPONENTS: Type<unknown>[] = [ButtonDemoComponent, ...EXAMPLES];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: DECLARATIONS,
  imports: [DemoSharedModule, ButtonDemoRoutingModule],
})
export class ButtonDemoModule {}
