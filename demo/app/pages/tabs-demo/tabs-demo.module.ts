import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { TabsDemoRoutingModule } from './tabs-demo-routing.module';
import { TabsDemoComponent } from './tabs-demo.component';

@NgModule({
  declarations: [TabsDemoComponent],
  imports: [DemoSharedModule, TabsDemoRoutingModule]
})
export class TabsDemoModule {}
