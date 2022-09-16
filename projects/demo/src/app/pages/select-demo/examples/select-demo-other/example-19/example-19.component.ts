import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-select-example-19',
  templateUrl: './example-19.component.html',
  styleUrls: ['./example-19.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectExample19Component {
  public readonly control: FormControl = new FormControl();
  public readonly options: string[] = ['Option 1', 'Option 2', 'Option 3'];
}
