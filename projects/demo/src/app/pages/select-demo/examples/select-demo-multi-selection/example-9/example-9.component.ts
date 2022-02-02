import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-select-example-9',
  templateUrl: './example-9.component.html',
  styleUrls: ['./example-9.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectExample9Component {
  public readonly control: FormControl = new FormControl([]);
}
