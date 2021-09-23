import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TileDemoComponent } from './tile-demo.component';

const routes: Routes = [
  {
    path: '',
    component: TileDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TileDemoRoutingModule {}
