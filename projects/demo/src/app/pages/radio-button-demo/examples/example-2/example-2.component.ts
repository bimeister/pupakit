import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-radio-button-example-2',
  templateUrl: './example-2.component.html',
  styleUrls: ['./example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonExample2Component {
  public formControlSmall: FormControl<number> = new FormControl<number>(1);
  public formControlMedium: FormControl<number> = new FormControl<number>(1);
}
