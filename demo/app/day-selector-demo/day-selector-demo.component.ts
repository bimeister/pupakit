import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { daysArrayToMap } from '../../../src/lib/components';
import { DaysMap, Weekdays } from './../../../src/internal';

@Component({
  selector: 'demo-spinner-demo',
  styleUrls: ['../demo.scss'],
  templateUrl: './day-selector-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DaySelectorDemoComponent {
  public days: typeof Weekdays = Weekdays;
  public daysSelected: number[] = [];
  public get daysSelectedMap(): DaysMap {
    return daysArrayToMap(this.daysSelected);
  }

  public form: FormGroup = new FormGroup({
    days: new FormControl([])
  });
}
