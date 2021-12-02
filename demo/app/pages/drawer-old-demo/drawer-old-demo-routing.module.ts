import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawerOldDemoComponent } from './drawer-old-demo.component';

const routes: Routes = [
  {
    path: '',
    component: DrawerOldDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrawerOldDemoRoutingModule {}
