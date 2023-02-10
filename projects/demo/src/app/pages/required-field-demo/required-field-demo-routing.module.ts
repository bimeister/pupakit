import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequiredFieldDemoComponent } from './required-field-demo.component';

const routes: Routes = [
  {
    path: '',
    component: RequiredFieldDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequiredFieldDemoRoutingModule {}
