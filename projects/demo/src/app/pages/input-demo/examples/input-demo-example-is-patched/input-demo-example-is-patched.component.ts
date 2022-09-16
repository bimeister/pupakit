import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'demo-input-demo-example-is-patched',
  templateUrl: './input-demo-example-is-patched.component.html',
  styleUrls: ['./input-demo-example-is-patched.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDemoExampleIsPatchedComponent {
  public readonly formControls: FormControl[] = [
    new FormControl('', [Validators.required, Validators.minLength(6)]),
    new FormControl('', [Validators.required, Validators.minLength(6)]),
  ];
}
