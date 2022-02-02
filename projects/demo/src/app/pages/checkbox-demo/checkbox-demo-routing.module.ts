import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckboxDemoComponent } from './checkbox-demo.component';

const routes: Routes = [
  {
    path: '',
    component: CheckboxDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckboxDemoRoutingModule {}
