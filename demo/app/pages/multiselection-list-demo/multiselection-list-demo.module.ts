import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { MultiselectionListDemoRoutingModule } from './multiselection-list-demo-routing.module';
import { MultiselectionListDemoComponent } from './multiselection-list-demo.component';

@NgModule({
  declarations: [MultiselectionListDemoComponent],
  imports: [DemoSharedModule, MultiselectionListDemoRoutingModule]
})
export class MultiselectionListDemoModule {}
