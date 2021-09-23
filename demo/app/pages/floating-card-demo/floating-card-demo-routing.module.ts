import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FloatingCardDemoComponent } from './floating-card-demo.component';

const routes: Routes = [
  {
    path: '',
    component: FloatingCardDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FloatingCardDemoRoutingModule {}
