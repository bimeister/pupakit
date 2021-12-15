import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-select-example-7',
  templateUrl: './example-7.component.html',
  styleUrls: ['./example-7.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectExample7Component {
  public readonly control: FormControl = new FormControl({ value: ['Option 2'], disabled: true });
  public readonly controlWithIcon: FormControl = new FormControl(['Option 3']);
}
