import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChipTabsDemoComponent } from './chip-tabs-demo.component';

const routes: Routes = [
  {
    path: '',
    component: ChipTabsDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChipTabsDemoRoutingModule {}
