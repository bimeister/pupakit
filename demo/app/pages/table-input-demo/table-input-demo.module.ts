import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { TableInputDemoRoutingModule } from './table-input-demo-routing.module';
import { TableInputDemoComponent } from './table-input-demo.component';

@NgModule({
  declarations: [TableInputDemoComponent],
  imports: [DemoSharedModule, TableInputDemoRoutingModule]
})
export class TableInputDemoModule {}
