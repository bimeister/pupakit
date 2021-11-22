import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { DrawerNewDemoRoutingModule } from './drawer-new-demo-routing.module';
import { DrawerNewDemoComponent } from './drawer-new-demo.component';
import { TestDrawerNewComponent } from './components/test-drawer-new/test-drawer-new.component';
import { DrawerLayoutExample1Component } from './examples/example-1/drawer-layout-example-1/drawer-layout-example-1.component';
import { DrawerTriggerExample1Component } from './examples/example-1/drawer-trigger-example-1/drawer-trigger-example-1.component';

@NgModule({
  declarations: [
    DrawerNewDemoComponent,
    TestDrawerNewComponent,
    DrawerLayoutExample1Component,
    DrawerTriggerExample1Component
  ],
  imports: [DemoSharedModule, DrawerNewDemoRoutingModule]
})
export class DrawerNewDemoModule {}
