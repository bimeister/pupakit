import { NgModule, Type } from '@angular/core';
import { PupaDirectivesModule } from '@bimeister/pupakit.common';
import { DemoSharedModule } from '../../shared/shared.module';
import { ButtonRoundDemoRoutingModule } from './button-round-demo-routing.module';
import { ButtonRoundDemoComponent } from './button-round-demo.component';
import { ButtonExample1Component } from './examples/example-1/example-1.component';
import { ButtonExample2Component } from './examples/example-2/example-2.component';

const EXAMPLES: Type<unknown>[] = [ButtonExample1Component, ButtonExample2Component];
const COMPONENTS: Type<unknown>[] = [ButtonRoundDemoComponent, ...EXAMPLES];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: DECLARATIONS,
  imports: [DemoSharedModule, ButtonRoundDemoRoutingModule, PupaDirectivesModule],
})
export class ButtonRoundDemoModule {}
