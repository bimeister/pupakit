import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'demo-input-demo-example-with-reset',
  templateUrl: './input-demo-example-with-reset.component.html',
  styleUrls: ['./input-demo-example-with-reset.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDemoExampleWithResetComponent {
  public readonly formControls: FormControl[] = new Array(2)
    .fill(0)
    .map(() => new FormControl('', Validators.required));
}
