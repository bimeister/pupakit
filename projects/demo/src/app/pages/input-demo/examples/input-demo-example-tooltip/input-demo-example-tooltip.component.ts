import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'demo-input-demo-example-tooltip',
  templateUrl: './input-demo-example-tooltip.component.html',
  styleUrls: ['./input-demo-example-tooltip.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputDemoExampleTooltipComponent {
  public readonly formControls: FormControl[] = [
    new FormControl('', Validators.required),
    new FormControl('', Validators.required),
    new FormControl('', Validators.required),
    new FormControl('', Validators.required),
  ];
}
