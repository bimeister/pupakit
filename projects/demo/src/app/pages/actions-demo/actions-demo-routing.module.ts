import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActionsDemoComponent } from './actions-demo.component';

const routes: Routes = [{ path: '', component: ActionsDemoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionsDemoRoutingModule {}
