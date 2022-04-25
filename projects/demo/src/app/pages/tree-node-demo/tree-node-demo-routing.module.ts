import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreeNodeDemoComponent } from './tree-node-demo.component';

const routes: Routes = [
  {
    path: '',
    component: TreeNodeDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TreeNodeDemoRoutingModule {}
