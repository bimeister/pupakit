import { NgModule, Type } from '@angular/core';
import { PupaDirectivesModule } from '@bimeister/pupakit.common';
import { DemoSharedModule } from '../../shared/shared.module';
import { ButtonIconDemoRoutingModule } from './button-icon-demo-routing.module';
import { ButtonIconDemoComponent } from './button-icon-demo.component';
import { ButtonExample1Component } from './examples/example-1/example-1.component';
import { ButtonExample2Component } from './examples/example-2/example-2.component';
import { ButtonExample3Component } from './examples/example-3/example-3.component';

const EXAMPLES: Type<unknown>[] = [ButtonExample1Component, ButtonExample3Component, ButtonExample2Component];
const COMPONENTS: Type<unknown>[] = [ButtonIconDemoComponent, ...EXAMPLES];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: DECLARATIONS,
  imports: [DemoSharedModule, ButtonIconDemoRoutingModule, PupaDirectivesModule],
})
export class ButtonIconDemoModule {}
