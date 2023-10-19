import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-select-example-21',
  templateUrl: './example-21.component.html',
  styleUrls: ['./example-21.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectExample21Component {
  public readonly control: FormControl = new FormControl([]);
  public readonly defaultValue: number = 1000000;
}
