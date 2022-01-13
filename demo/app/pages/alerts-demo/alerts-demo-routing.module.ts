import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlertsDemoComponent } from './alerts-demo.component';

const routes: Routes = [{ path: '', component: AlertsDemoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertsDemoRoutingModule {}
