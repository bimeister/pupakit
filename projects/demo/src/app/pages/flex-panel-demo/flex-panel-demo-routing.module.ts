import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlexPanelDemoComponent } from './flex-panel-demo.component';

const routes: Routes = [
  {
    path: '',
    component: FlexPanelDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlexPanelDemoRoutingModule {}
