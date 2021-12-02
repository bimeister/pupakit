import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScrollableDemoComponent } from './scrollable-demo.component';

const routes: Routes = [
  {
    path: '',
    component: ScrollableDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScrollableDemoRoutingModule {}
