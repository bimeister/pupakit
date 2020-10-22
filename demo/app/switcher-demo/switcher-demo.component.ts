import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as Combos from 'combos';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'demo-switcher',
  styleUrls: ['../demo.scss'],
  templateUrl: './switcher-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwitcherDemoComponent {
  public value: boolean = false;

  public readonly combos: any[] = Combos({
    disabled: [true, false],
    indifferent: [true, false]
  });

  public readonly form: FormGroup = new FormGroup({
    switcher: new FormControl(true)
  });
}
