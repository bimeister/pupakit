import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ToastsDemoComponent } from './toasts-demo.component';

const routes: Routes = [{ path: '', component: ToastsDemoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToastsDemoRoutingModule {}
