import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoaderDemoComponent } from './loader-demo.component';

const routes: Routes = [
  {
    path: '',
    component: LoaderDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoaderDemoRoutingModule {}
