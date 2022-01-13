import { NgModule } from '@angular/core';

import { DemoSharedModule } from '../../shared/shared.module';
import { TimerDemoRoutingModule } from './timer-demo-routing.module';
import { TimerDemoComponent } from './timer-demo.component';
import { BasicExampleComponent } from './examples/basic-example/basic-example.component';

@NgModule({
  declarations: [TimerDemoComponent, BasicExampleComponent],
  imports: [DemoSharedModule, TimerDemoRoutingModule],
})
export class TimerDemoModule {}
