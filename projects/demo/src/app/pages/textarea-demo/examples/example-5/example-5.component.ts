import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-textarea-example-5',
  templateUrl: './example-5.component.html',
  styleUrls: ['./example-5.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaExample5Component {
  public readonly control: FormControl = new FormControl();
}
