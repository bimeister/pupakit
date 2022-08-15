import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfinityScrollerDemoComponent } from './infinity-scroller-demo.component';

const routes: Routes = [
  {
    path: '',
    component: InfinityScrollerDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfinityScrollerDemoRoutingModule {}
