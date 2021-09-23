import { NgModule } from '@angular/core';
import { DemoSharedModule } from '../../shared/shared.module';
import { DateTimePickerDemoRoutingModule } from './date-time-picker-demo-routing.module';
import { DateTimePickerDemoComponent } from './date-time-picker-demo.component';

@NgModule({
  declarations: [DateTimePickerDemoComponent],
  imports: [DemoSharedModule, DateTimePickerDemoRoutingModule]
})
export class DateTimePickerDemoModule {}
