import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-button',
  styleUrls: ['./radio-button-demo.component.scss'],
  templateUrl: './radio-button-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonDemoComponent {
  public formControl: FormControl = new FormControl(1);

  constructor() {
    // this.formControl.disable();
    // eslint-disable-next-line no-console
    this.formControl.valueChanges.subscribe((data: number) => console.log(data));
  }
}
