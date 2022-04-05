import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DropdownDemoComponent } from './dropdown-demo.component';

const routes: Routes = [
  {
    path: '',
    component: DropdownDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DropdownRoutingModule {}
