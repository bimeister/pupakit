import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IconButtonDemoComponent } from './icon-button-demo.component';

const routes: Routes = [
  {
    path: '',
    component: IconButtonDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IconButtonDemoRoutingModule {}
