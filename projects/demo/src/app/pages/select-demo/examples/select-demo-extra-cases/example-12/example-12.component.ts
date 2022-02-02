import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-select-example-12',
  templateUrl: './example-12.component.html',
  styleUrls: ['./example-12.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectExample12Component {
  public readonly controlButton: FormControl = new FormControl([]);
  public readonly controlTag: FormControl = new FormControl([]);
}
