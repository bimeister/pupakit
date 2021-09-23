import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColorsDemoComponent } from './colors-demo.component';

const routes: Routes = [
  {
    path: '',
    component: ColorsDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ColorsDemoRoutingModule {}
