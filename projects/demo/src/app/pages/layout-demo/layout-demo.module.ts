import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { LayoutDemoRoutingModule } from './layout-demo-routing.module';
import { LayoutDemoComponent } from './layout-demo.component';

@NgModule({
  declarations: [LayoutDemoComponent],
  imports: [DemoSharedModule, LayoutDemoRoutingModule],
})
export class LayoutDemoModule {}
