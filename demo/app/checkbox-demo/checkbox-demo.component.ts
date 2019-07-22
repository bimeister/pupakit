import { ChangeDetectionStrategy, Component } from '@angular/core';
import combos from 'combos';

@Component({
  selector: 'demo-checkbox',
  styleUrls: ['../demo.scss'],
  templateUrl: './checkbox-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxDemoComponent {

  public readonly combos: any[] = combos({
    value: [true],
    indeterminate: [true, false],
    disabled: [false, true],
    label: ['', 'sample-text']
  });

  /* tslint:disable */
  public log(v: any): void {
    console.log(v);
  }
  /* tslint:enable */
}
