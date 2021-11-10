import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabelDemoComponent } from './label-demo.component';

const routes: Routes = [
  {
    path: '',
    component: LabelDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabelDemoRoutingModule {}
