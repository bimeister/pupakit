import { NgModule } from '@angular/core';
import { CheckboxModule } from '@kit/lib/components/checkbox/checkbox.module';
import { DemoSharedModule } from '../../shared/shared.module';
import { CheckboxDemoRoutingModule } from './checkbox-demo-routing.module';
import { CheckboxDemoComponent } from './checkbox-demo.component';
import { CheckboxDemoExample1Component } from './examples/example-1/example-1.component';
import { CheckboxDemoExample2Component } from './examples/example-2/example-2.component';
import { CheckboxDemoExample3Component } from './examples/example-3/example-3.component';

@NgModule({
  declarations: [
    CheckboxDemoComponent,
    CheckboxDemoExample1Component,
    CheckboxDemoExample2Component,
    CheckboxDemoExample3Component,
  ],
  imports: [DemoSharedModule, CheckboxDemoRoutingModule, CheckboxModule],
})
export class CheckboxDemoModule {}
