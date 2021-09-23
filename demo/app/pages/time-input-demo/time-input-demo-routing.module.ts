import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimeInputDemoComponent } from './time-input-demo.component';

const routes: Routes = [
  {
    path: '',
    component: TimeInputDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeInputDemoRoutingModule {}
