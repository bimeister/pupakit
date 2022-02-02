import { NgModule } from '@angular/core';
import { CheckboxModule } from '../../../../../src/lib/components/checkbox/checkbox.module';
import { DemoSharedModule } from '../../shared/shared.module';
import { CheckboxDemoRoutingModule } from './checkbox-demo-routing.module';
import { CheckboxDemoComponent } from './checkbox-demo.component';
import { CheckboxDemoExampleComponent } from './examples/checkbox-demo-example/checkbox-demo-example.component';

@NgModule({
  declarations: [CheckboxDemoComponent, CheckboxDemoExampleComponent],
  imports: [DemoSharedModule, CheckboxDemoRoutingModule, CheckboxModule],
})
export class CheckboxDemoModule {}
