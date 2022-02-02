import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { DrawerOldDemoRoutingModule } from './drawer-old-demo-routing.module';
import { DrawerOldDemoComponent } from './drawer-old-demo.component';

@NgModule({
  declarations: [DrawerOldDemoComponent],
  imports: [DemoSharedModule, DrawerOldDemoRoutingModule],
})
export class DrawerOldDemoModule {}
