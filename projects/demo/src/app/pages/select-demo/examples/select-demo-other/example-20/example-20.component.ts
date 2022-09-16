import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-select-example-20',
  templateUrl: './example-20.component.html',
  styleUrls: ['./example-20.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectExample20Component {
  public readonly control: FormControl = new FormControl();
  public readonly options: string[] = ['Option 1', 'Option 2', 'Option 3'];
}
