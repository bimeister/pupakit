import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SectionDemoComponent } from './section-demo.component';

const routes: Routes = [
  {
    path: '',
    component: SectionDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SectionDemoRoutingModule {}
