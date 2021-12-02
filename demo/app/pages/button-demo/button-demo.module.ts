import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { ButtonDemoRoutingModule } from './button-demo-routing.module';
import { ButtonDemoComponent } from './button-demo.component';

@NgModule({
  declarations: [ButtonDemoComponent],
  imports: [DemoSharedModule, ButtonDemoRoutingModule],
})
export class ButtonDemoModule {}
