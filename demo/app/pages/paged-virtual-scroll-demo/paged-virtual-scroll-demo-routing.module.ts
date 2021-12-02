import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagedVirtualScrollDemoComponent } from './paged-virtual-scroll-demo.component';

const routes: Routes = [
  {
    path: '',
    component: PagedVirtualScrollDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagedVirtualScrollDemoRoutingModule {}
