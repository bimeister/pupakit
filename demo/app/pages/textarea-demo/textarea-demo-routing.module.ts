import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TextareaDemoComponent } from './textarea-demo.component';

const routes: Routes = [
  {
    path: '',
    component: TextareaDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TextareaDemoRoutingModule {}
