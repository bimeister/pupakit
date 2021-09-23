import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableInputDemoComponent } from './table-input-demo.component';

const routes: Routes = [
  {
    path: '',
    component: TableInputDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableInputDemoRoutingModule {}
