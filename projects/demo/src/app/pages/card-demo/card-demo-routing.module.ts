import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardDemoComponent } from './card-demo.component';

const routes: Routes = [
  {
    path: '',
    component: CardDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardDemoRoutingModule {}
