import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScrollbarDemoComponent } from './scrollbar-demo.component';

const routes: Routes = [
  {
    path: '',
    component: ScrollbarDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScrollbarDemoRoutingModule {}
