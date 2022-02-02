import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatusDemoComponent } from './status-demo.component';

const routes: Routes = [
  {
    path: '',
    component: StatusDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusDemoRoutingModule {}
