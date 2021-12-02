import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DateTimePickerDemoComponent } from './date-time-picker-demo.component';

const routes: Routes = [
  {
    path: '',
    component: DateTimePickerDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DateTimePickerDemoRoutingModule {}
