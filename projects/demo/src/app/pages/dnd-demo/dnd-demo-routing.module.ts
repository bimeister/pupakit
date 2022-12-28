import { RouterModule, Routes } from '@angular/router';
import { DndDemoComponent } from './dnd-demo.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: DndDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DndDemoRoutingModule {}
