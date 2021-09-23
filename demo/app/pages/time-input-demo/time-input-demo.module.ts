import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { TimeInputDemoRoutingModule } from './time-input-demo-routing.module';
import { TimeInputDemoComponent } from './time-input-demo.component';

@NgModule({
  declarations: [TimeInputDemoComponent],
  imports: [DemoSharedModule, TimeInputDemoRoutingModule]
})
export class TimeInputDemoModule {}
