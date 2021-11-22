import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawerNewDemoComponent } from './drawer-new-demo.component';

const routes: Routes = [
  {
    path: '',
    component: DrawerNewDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DrawerNewDemoRoutingModule {}
