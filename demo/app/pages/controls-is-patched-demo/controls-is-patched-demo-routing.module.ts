import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlsIsPatchedDemoComponent } from './controls-is-patched-demo.component';

const routes: Routes = [
  {
    path: '',
    component: ControlsIsPatchedDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlsIsPatchedDemoRoutingModule {}
