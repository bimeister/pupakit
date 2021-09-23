import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { RadioButtonDemoRoutingModule } from './radio-button-demo-routing.module';
import { RadioButtonDemoComponent } from './radio-button-demo.component';

@NgModule({
  declarations: [RadioButtonDemoComponent],
  imports: [DemoSharedModule, RadioButtonDemoRoutingModule]
})
export class RadioButtonDemoModule {}
