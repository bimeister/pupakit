import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChipButtonDemoComponent } from './chip-button-demo.component';

const routes: Routes = [
  {
    path: '',
    component: ChipButtonDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChipButtonDemoRoutingModule {}
