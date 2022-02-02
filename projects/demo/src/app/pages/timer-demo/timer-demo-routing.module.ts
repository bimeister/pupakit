import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimerDemoComponent } from './timer-demo.component';

const routes: Routes = [{ path: '', component: TimerDemoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimerDemoRoutingModule {}
