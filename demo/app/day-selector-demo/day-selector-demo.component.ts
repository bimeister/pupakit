import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import {
  daysArrayToMap,
  DaysMap,
  Weekdays
} from '../../../src/lib/day-selector/components/day-selector/day-selector.component';

@Component({
  selector: 'demo-spinner-demo',
  styleUrls: ['../demo.scss'],
  templateUrl: './day-selector-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DaySelectorDemoComponent {
  public days: any = Weekdays;
  public daysSelected: number[] = [];
  public get daysSelectedMap(): DaysMap {
    return daysArrayToMap(this.daysSelected);
  }

  public form: FormGroup = new FormGroup({
    days: new FormControl([])
  });
}
