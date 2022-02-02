import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DropdownMenuDemoComponent } from './dropdown-menu-demo.component';

const routes: Routes = [
  {
    path: '',
    component: DropdownMenuDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DropdownMenuDemoRoutingModule {}
