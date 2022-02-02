import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { SpinnerDemoRoutingModule } from './spinner-demo-routing.module';
import { SpinnerDemoComponent } from './spinner-demo.component';

@NgModule({
  declarations: [SpinnerDemoComponent],
  imports: [DemoSharedModule, SpinnerDemoRoutingModule],
})
export class SpinnerDemoModule {}
