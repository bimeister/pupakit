import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadsDemoComponent } from './uploads-demo.component';

const routes: Routes = [
  {
    path: '',
    component: UploadsDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadsDemoRoutingModule {}
