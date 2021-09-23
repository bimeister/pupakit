import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwitcherDemoComponent } from './switcher-demo.component';

const routes: Routes = [
  {
    path: '',
    component: SwitcherDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SwitcherDemoRoutingModule {}
