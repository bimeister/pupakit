import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoBlockDemoComponent } from './info-block-demo.component';

const routes: Routes = [
  {
    path: '',
    component: InfoBlockDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoBlockDemoRoutingModule {}
