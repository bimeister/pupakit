import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdaptiveDemoComponent } from './adaptive-demo.component';

const routes: Routes = [
  {
    path: '',
    component: AdaptiveDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdaptiveDemoRoutingModule {}
