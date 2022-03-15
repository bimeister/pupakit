import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PopoverDemoComponent } from './popover-demo.component';

const routes: Routes = [
  {
    path: '',
    component: PopoverDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverDemoRoutingModule {}
