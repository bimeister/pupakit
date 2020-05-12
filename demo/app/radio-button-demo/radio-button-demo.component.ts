import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-button',
  styleUrls: ['../demo.scss', './radio-button-demo.component.scss'],
  templateUrl: './radio-button-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioButtonDemoComponent {
  public formControl: FormControl = new FormControl(1);

  constructor() {
    // this.formControl.disable();
    // tslint:disable-next-line: no-console
    this.formControl.valueChanges.subscribe(data => console.log(data));
  }
}
