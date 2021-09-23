import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectorDemoComponent } from './selector-demo.component';

const routes: Routes = [
  {
    path: '',
    component: SelectorDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectorDemoRoutingModule {}
