import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultiselectionListDemoComponent } from './multiselection-list-demo.component';

const routes: Routes = [
  {
    path: '',
    component: MultiselectionListDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MultiselectionListDemoRoutingModule {}
