import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-locale-day-selector-example',
  templateUrl: './demo-locale-day-selector-example.component.html',
  styleUrls: ['./demo-locale-day-selector-example.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoLocaleDaySelectorExampleComponent {
  public readonly formControl: FormControl = new FormControl([]);
}
