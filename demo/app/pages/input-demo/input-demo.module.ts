import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { InputDemoRoutingModule } from './input-demo-routing.module';
import { InputDemoComponent } from './input-demo.component';

@NgModule({
  declarations: [InputDemoComponent],
  imports: [DemoSharedModule, InputDemoRoutingModule]
})
export class InputDemoModule {}
