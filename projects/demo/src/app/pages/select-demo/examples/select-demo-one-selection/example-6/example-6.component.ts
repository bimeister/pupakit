import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-select-example-6',
  templateUrl: './example-6.component.html',
  styleUrls: ['./example-6.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectExample6Component {
  public readonly control: FormControl = new FormControl([]);
  public readonly controlWithIcon: FormControl = new FormControl([]);
}
