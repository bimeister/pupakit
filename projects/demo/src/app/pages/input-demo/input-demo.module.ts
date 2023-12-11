import { NgModule } from '@angular/core';
import { PupaDirectivesModule } from '@bimeister/pupakit.common';
import { InputDemoExampleActionComponent } from 'src/app/pages/input-demo/examples/input-demo-example-action/input-demo-example-action.component';
import { DemoSharedModule } from '../../shared/shared.module';
import { InputDemoExampleAllInputsComponent } from './examples/input-demo-example-all-inputs/input-demo-example-all-inputs.component';
import { InputDemoExampleIsPatchedComponent } from './examples/input-demo-example-is-patched/input-demo-example-is-patched.component';
import { InputDemoExampleSizeComponent } from './examples/input-demo-example-size/input-demo-example-size.component';
import { InputDemoExampleStylesComponent } from './examples/input-demo-example-styles/input-demo-example-styles.component';
import { InputDemoExampleTooltipComponent } from './examples/input-demo-example-tooltip/input-demo-example-tooltip.component';
import { InputDemoExampleWithResetComponent } from './examples/input-demo-example-with-reset/input-demo-example-with-reset.component';
import { InputDemoRoutingModule } from './input-demo-routing.module';
import { InputDemoComponent } from './input-demo.component';

@NgModule({
  declarations: [
    InputDemoComponent,
    InputDemoExampleSizeComponent,
    InputDemoExampleWithResetComponent,
    InputDemoExampleAllInputsComponent,
    InputDemoExampleTooltipComponent,
    InputDemoExampleIsPatchedComponent,
    InputDemoExampleStylesComponent,
    InputDemoExampleActionComponent,
  ],
  imports: [DemoSharedModule, InputDemoRoutingModule, PupaDirectivesModule],
})
export class InputDemoModule {}
