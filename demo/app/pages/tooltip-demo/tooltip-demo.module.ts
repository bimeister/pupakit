import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { TooltipDemoRoutingModule } from './tooltip-demo-routing.module';
import { TooltipDemoComponent } from './tooltip-demo.component';

@NgModule({
  declarations: [TooltipDemoComponent],
  imports: [DemoSharedModule, TooltipDemoRoutingModule]
})
export class TooltipDemoModule {}
