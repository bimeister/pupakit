import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonIconDemoComponent } from './button-icon-demo.component';

const routes: Routes = [
  {
    path: '',
    component: ButtonIconDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ButtonIconDemoRoutingModule {}
