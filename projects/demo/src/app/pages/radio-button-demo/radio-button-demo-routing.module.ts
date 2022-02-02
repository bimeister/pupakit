import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RadioButtonDemoComponent } from './radio-button-demo.component';

const routes: Routes = [
  {
    path: '',
    component: RadioButtonDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RadioButtonDemoRoutingModule {}
