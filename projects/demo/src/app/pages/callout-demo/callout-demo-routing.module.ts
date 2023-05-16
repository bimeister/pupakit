import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalloutDemoComponent } from './callout-demo.component';

const routes: Routes = [
  {
    path: '',
    component: CalloutDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalloutDemoRoutingModule {}
