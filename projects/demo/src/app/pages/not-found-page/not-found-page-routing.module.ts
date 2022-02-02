import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page.component';

const routes: Routes = [
  {
    path: '',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotFoundPageRoutingModule {}
