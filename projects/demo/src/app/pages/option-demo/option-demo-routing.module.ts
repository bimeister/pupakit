import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OptionDemoComponent } from './option-demo.component';

const routes: Routes = [
  {
    path: '',
    component: OptionDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OptionDemoRoutingModule {}
