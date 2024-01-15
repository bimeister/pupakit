import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'demo-input-demo-example-action',
  templateUrl: './input-demo-example-action.component.html',
  styleUrls: ['./input-demo-example-action.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDemoExampleActionComponent {
  public readonly formControls: FormControl[] = [
    new FormControl('', [Validators.required, Validators.maxLength(5)]),
    new FormControl('', Validators.required),
    new FormControl('', Validators.required),
    new FormControl('', Validators.required),
  ];
}
