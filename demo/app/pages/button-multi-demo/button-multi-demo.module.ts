import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { ButtonMultiDemoRoutingModule } from './button-multi-demo-routing.module';
import { ButtonMultiDemoComponent } from './button-multi-demo.component';

@NgModule({
  declarations: [ButtonMultiDemoComponent],
  imports: [DemoSharedModule, ButtonMultiDemoRoutingModule]
})
export class ButtonMultiDemoModule {}
