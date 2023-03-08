import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarDemoComponent } from './calendar-demo.component';

const routes: Routes = [
  {
    path: '',
    component: CalendarDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarDemoRoutingModule {}
