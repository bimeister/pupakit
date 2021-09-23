import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsDemoComponent } from './tabs-demo.component';

const routes: Routes = [
  {
    path: '',
    component: TabsDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsDemoRoutingModule {}
