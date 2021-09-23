import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectMultipleDemoComponent } from './select-multiple-demo.component';

const routes: Routes = [
  {
    path: '',
    component: SelectMultipleDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectMultipleDemoRoutingModule {}
