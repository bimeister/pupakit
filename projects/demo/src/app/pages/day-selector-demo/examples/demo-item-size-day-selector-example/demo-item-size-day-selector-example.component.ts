import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-item-size-day-selector-example',
  templateUrl: './demo-item-size-day-selector-example.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoItemSizeDaySelectorExampleComponent {
  public readonly formControl: FormControl = new FormControl([]);
}
