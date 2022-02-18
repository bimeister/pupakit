import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounterDemoComponent } from './counter-demo.component';

const routes: Routes = [
  {
    path: '',
    component: CounterDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CounterDemoRoutingModule {}
