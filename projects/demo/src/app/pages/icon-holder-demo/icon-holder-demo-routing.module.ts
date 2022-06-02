import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IconHolderDemoComponent } from './icon-holder-demo.component';

const routes: Routes = [
  {
    path: '',
    component: IconHolderDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IconHolderDemoRoutingModule {}
