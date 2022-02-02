import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-textarea-example-3',
  templateUrl: './example-3.component.html',
  styleUrls: ['./example-3.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaExample3Component {
  public readonly control: FormControl = new FormControl();
}
