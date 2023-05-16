import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'demo-required-field-example-2',
  styleUrls: ['./example-2.component.scss'],
  templateUrl: './example-2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class RequiredFieldExample2Component {
  public readonly isRequiredControl: FormControl<boolean> = new FormControl<boolean>(true);
}
