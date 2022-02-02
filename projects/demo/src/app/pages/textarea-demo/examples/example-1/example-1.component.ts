import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-textarea-example-1',
  templateUrl: './example-1.component.html',
  styleUrls: ['./example-1.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaExample1Component {
  public readonly control: FormControl = new FormControl();
}
