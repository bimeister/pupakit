import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResizerDemoComponent } from './resizer-demo.component';

const routes: Routes = [
  {
    path: '',
    component: ResizerDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResizerDemoRoutingModule {}
