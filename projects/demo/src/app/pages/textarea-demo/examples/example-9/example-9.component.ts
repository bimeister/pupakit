import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

const EXAMPLE_VALUE: string =
  'JavaScript is a text-based programming language used both on the client-side and server-side that allows you to make web pages interactive.';

@Component({
  selector: 'demo-textarea-example-9',
  templateUrl: './example-9.component.html',
  styleUrls: ['./example-9.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaExample9Component {
  public readonly control: FormControl<string> = new FormControl<string>(EXAMPLE_VALUE, [
    Validators.required,
    Validators.maxLength(100),
  ]);
}
