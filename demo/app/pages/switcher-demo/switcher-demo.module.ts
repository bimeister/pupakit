import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { SwitcherDemoRoutingModule } from './switcher-demo-routing.module';
import { SwitcherDemoComponent } from './switcher-demo.component';

@NgModule({
  declarations: [SwitcherDemoComponent],
  imports: [DemoSharedModule, SwitcherDemoRoutingModule]
})
export class SwitcherDemoModule {}
