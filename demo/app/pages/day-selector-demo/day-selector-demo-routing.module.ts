import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DaySelectorDemoComponent } from './day-selector-demo.component';

const routes: Routes = [
  {
    path: '',
    component: DaySelectorDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DaySelectorDemoRoutingModule {}
