import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CodeDemoComponent } from './code-demo.component';

const routes: Routes = [
  {
    path: '',
    component: CodeDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CodeDemoRoutingModule {}
