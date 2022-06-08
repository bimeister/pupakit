import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

const OPTIONS_COUNT: number = 10;

@Component({
  selector: 'demo-select-example-17',
  templateUrl: './example-17.component.html',
  styleUrls: ['./example-17.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectExample17Component {
  public readonly control1: FormControl = new FormControl([], Validators.required);
  public readonly control2: FormControl = new FormControl([], Validators.required);
  public readonly control3: FormControl = new FormControl([], Validators.required);

  public readonly isPatchedControl: FormControl = new FormControl(false);
  public readonly invalidTooltipDisabledControl: FormControl = new FormControl(false);

  public readonly options: string[] = Array(OPTIONS_COUNT)
    .fill(null)
    .map((_: null, index: number) => `Option ${index + 1}`);
}
