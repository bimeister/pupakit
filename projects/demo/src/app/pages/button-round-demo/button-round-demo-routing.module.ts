import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonRoundDemoComponent } from './button-round-demo.component';

const routes: Routes = [
  {
    path: '',
    component: ButtonRoundDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ButtonRoundDemoRoutingModule {}
