import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-input-demo-example-placeholder',
  templateUrl: './input-demo-example-placeholder.component.html',
  styleUrls: ['./input-demo-example-placeholder.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDemoExamplePlaceholderComponent {
  public readonly textControl1: FormControl = new FormControl();
  public readonly textControl2: FormControl = new FormControl();
}
