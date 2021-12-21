import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HugeTreeDemoComponent } from './huge-tree-demo.component';

const routes: Routes = [
  {
    path: '',
    component: HugeTreeDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HugeTreeDemoRoutingModule {}
