import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawerDemoComponent } from './drawer-demo.component';

const routes: Routes = [
  {
    path: '',
    component: DrawerDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DrawerDemoRoutingModule {}
