import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { DatagridDemoRoutingModule } from './datagrid-demo-routing.module';
import { DatagridDemoComponent } from './datagrid-demo.component';

@NgModule({
  declarations: [DatagridDemoComponent],
  imports: [DemoSharedModule, DatagridDemoRoutingModule],
})
export class DatagridDemoModule {}
