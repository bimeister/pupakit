import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { CheckboxDemoRoutingModule } from './checkbox-demo-routing.module';
import { CheckboxDemoComponent } from './checkbox-demo.component';

@NgModule({
  declarations: [CheckboxDemoComponent],
  imports: [DemoSharedModule, CheckboxDemoRoutingModule]
})
export class CheckboxDemoModule {}
