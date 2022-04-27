import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-plain-day-selector-example',
  templateUrl: './demo-plain-day-selector-example.component.html',
  styleUrls: ['demo-plain-day-selector-example.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoPlainDaySelectorExampleComponent {
  public readonly formControl: FormControl = new FormControl([]);
  public readonly anotherFormControl: FormControl = new FormControl([1, 3, 4]);

  constructor() {
    this.anotherFormControl.disable();
  }
}
