import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoaderOldDemoComponent } from './loader-old-demo.component';

const routes: Routes = [
  {
    path: '',
    component: LoaderOldDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoaderOldDemoRoutingModule {}
