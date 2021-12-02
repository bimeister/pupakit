import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DroppableDemoComponent } from './droppable-demo.component';

const routes: Routes = [
  {
    path: '',
    component: DroppableDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DroppableDemoRoutingModule {}
