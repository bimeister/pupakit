import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IconDemoComponent } from './icon-demo.component';

const routes: Routes = [
  {
    path: '',
    component: IconDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IconDemoRoutingModule {}
