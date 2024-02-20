import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DividerDemoComponent } from './divider-demo.component';

const routes: Routes = [
  {
    path: '',
    component: DividerDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DividerDemoRoutingModule {}
