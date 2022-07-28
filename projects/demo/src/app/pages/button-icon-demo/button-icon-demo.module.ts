import { NgModule, Type } from '@angular/core';
import { ButtonIconDemoRoutingModule } from './button-icon-demo-routing.module';
import { DemoSharedModule } from '../../shared/shared.module';
import { DirectivesModule } from '@kit/internal/directives/directives.module';
import { ButtonExample1Component } from './examples/example-1/example-1.component';
import { ButtonIconDemoComponent } from './button-icon-demo.component';
import { ButtonExample2Component } from './examples/example-2/example-2.component';
import { ButtonExample3Component } from './examples/example-3/example-3.component';

const EXAMPLES: Type<unknown>[] = [ButtonExample1Component, ButtonExample3Component, ButtonExample2Component];
const COMPONENTS: Type<unknown>[] = [ButtonIconDemoComponent, ...EXAMPLES];

const DECLARATIONS: Type<unknown>[] = [...COMPONENTS];

@NgModule({
  declarations: DECLARATIONS,
  imports: [DemoSharedModule, ButtonIconDemoRoutingModule, DirectivesModule],
})
export class ButtonIconDemoModule {}
