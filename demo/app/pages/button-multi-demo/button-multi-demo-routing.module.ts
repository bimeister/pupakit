import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonMultiDemoComponent } from './button-multi-demo.component';

const routes: Routes = [
  {
    path: '',
    component: ButtonMultiDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ButtonMultiDemoRoutingModule {}
