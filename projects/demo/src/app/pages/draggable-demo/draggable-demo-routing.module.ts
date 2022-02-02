import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DraggableDemoComponent } from './draggable-demo.component';

const routes: Routes = [
  {
    path: '',
    component: DraggableDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DraggableDemoRoutingModule {}
