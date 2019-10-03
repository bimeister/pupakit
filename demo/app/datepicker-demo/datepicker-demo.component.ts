import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-datepicker-demo',
  templateUrl: './datepicker-demo.component.html',
  styleUrls: ['./datepicker-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerDemoComponent {}
