import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TreeNewDemoComponent } from './tree-new-demo.component';

const routes: Routes = [
  {
    path: '',
    component: TreeNewDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreeNewDemoRoutingModule {}
