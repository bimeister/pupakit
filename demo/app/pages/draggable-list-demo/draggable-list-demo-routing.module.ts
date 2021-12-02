import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DraggableListDemoComponent } from './draggable-demo.component';

const routes: Routes = [
  {
    path: '',
    component: DraggableListDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DraggableListDemoRoutingModule {}
