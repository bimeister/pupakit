import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChipDemoComponent } from './chip-demo.component';

const routes: Routes = [
  {
    path: '',
    component: ChipDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChipDemoRoutingModule {}
