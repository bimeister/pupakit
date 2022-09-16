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
  public readonly formControls: FormControl[] = [
    new FormControl('', Validators.required),
    new FormControl('', Validators.required),
  ];
}
