import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvatarDemoComponent } from './avatar-demo.component';

const routes: Routes = [
  {
    path: '',
    component: AvatarDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvatarDemoRoutingModule {}
