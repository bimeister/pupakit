import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'demo-datepicker-demo',
  templateUrl: './datepicker-demo.component.html',
  styleUrls: ['../demo.scss', './datepicker-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatepickerDemoComponent {}
