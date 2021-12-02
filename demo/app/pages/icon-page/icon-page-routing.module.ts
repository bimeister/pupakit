import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IconPageComponent } from './icon-page.component';

const routes: Routes = [
  {
    path: '',
    component: IconPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IconPageRoutingModule {}
