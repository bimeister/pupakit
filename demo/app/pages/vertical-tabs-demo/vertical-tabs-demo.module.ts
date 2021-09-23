import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { VerticalTabsDemoRoutingModule } from './vertical-tabs-demo-routing.module';
import { VerticalTabsDemoComponent } from './vertical-tabs-demo.component';

@NgModule({
  declarations: [VerticalTabsDemoComponent],
  imports: [DemoSharedModule, VerticalTabsDemoRoutingModule]
})
export class VerticalTabsDemoModule {}
