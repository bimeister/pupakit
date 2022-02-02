import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalDemoComponent } from './modal-demo.component';

const routes: Routes = [
  {
    path: '',
    component: ModalDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalDemoRoutingModule {}
