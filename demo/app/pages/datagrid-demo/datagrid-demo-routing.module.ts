import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatagridDemoComponent } from './datagrid-demo.component';

const routes: Routes = [
  {
    path: '',
    component: DatagridDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatagridDemoRoutingModule {}
