import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BadgeDemoComponent } from './badge-demo.component';

const routes: Routes = [
  {
    path: '',
    component: BadgeDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BadgeDemoRoutingModule {}
