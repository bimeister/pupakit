import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { DrawerDemoRoutingModule } from './drawer-demo-routing.module';
import { DrawerDemoComponent } from './drawer-demo.component';

@NgModule({
  declarations: [DrawerDemoComponent],
  imports: [DemoSharedModule, DrawerDemoRoutingModule]
})
export class DrawerDemoModule {}
