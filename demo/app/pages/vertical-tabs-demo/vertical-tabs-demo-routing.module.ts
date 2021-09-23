import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerticalTabsDemoComponent } from './vertical-tabs-demo.component';

const routes: Routes = [
  {
    path: '',
    component: VerticalTabsDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerticalTabsDemoRoutingModule {}
