import { NgModule, Type } from '@angular/core';
import { ButtonRoundDemoRoutingModule } from './button-round-demo-routing.module';
import { DemoSharedModule } from '../../shared/shared.module';
import { DirectivesModule } from '@kit/internal/directives/directives.module';
import { ButtonExample1Component } from './examples/example-1/example-1.component';
import { ButtonRoundDemoComponent } from './button-round-demo.component';
import { ButtonExample2Component } from './examples/example-2/example-2.component';

const EXAMPLES: Type<unknown>[] = [ButtonExample1Component, ButtonExample2Component];
const COMPONENTS: Type<unknown>[] = [ButtonRoundDemoComponent, ...EXAMPLES];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: DECLARATIONS,
  imports: [DemoSharedModule, ButtonRoundDemoRoutingModule, DirectivesModule],
})
export class ButtonRoundDemoModule {}
