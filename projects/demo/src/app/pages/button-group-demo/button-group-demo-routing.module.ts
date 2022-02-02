import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonGroupDemoComponent } from './button-group-demo.component';

const routes: Routes = [
  {
    path: '',
    component: ButtonGroupDemoComponent,
    children: [
      {
        path: '**',
        component: ButtonGroupDemoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ButtonGroupDemoRoutingModule {}
