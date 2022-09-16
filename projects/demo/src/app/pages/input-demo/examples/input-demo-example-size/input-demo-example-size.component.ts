import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-input-demo-example-size',
  templateUrl: './input-demo-example-size.component.html',
  styleUrls: ['./input-demo-example-size.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDemoExampleSizeComponent {
  public readonly mediumTextControl: FormControl = new FormControl('medium size');
  public readonly largeTextControl: FormControl = new FormControl('large size');
}
