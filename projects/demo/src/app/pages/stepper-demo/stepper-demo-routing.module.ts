import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepperDemoComponent } from './stepper-demo.component';

const routes: Routes = [
  {
    path: '',
    component: StepperDemoComponent,
    children: [
      {
        path: '**',
        component: StepperDemoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepperDemoRoutingModule {}
