import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { DrawerDemoRoutingModule } from './drawer-demo-routing.module';
import { DrawerDemoComponent } from './drawer-demo.component';
import { TestDrawerComponent } from './components/test-drawer/test-drawer.component';
import { DrawerLayoutExample1Component } from './examples/example-1/drawer-layout-example-1/drawer-layout-example-1.component';
import { DrawerTriggerExample1Component } from './examples/example-1/drawer-trigger-example-1/drawer-trigger-example-1.component';

@NgModule({
  declarations: [
    DrawerDemoComponent,
    TestDrawerComponent,
    DrawerLayoutExample1Component,
    DrawerTriggerExample1Component
  ],
  imports: [DemoSharedModule, DrawerDemoRoutingModule]
})
export class DrawerDemoModule {}
