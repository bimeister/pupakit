import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchFieldDemoComponent } from './search-field-demo.component';

const routes: Routes = [
  {
    path: '',
    component: SearchFieldDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchFieldDemoRoutingModule {}
