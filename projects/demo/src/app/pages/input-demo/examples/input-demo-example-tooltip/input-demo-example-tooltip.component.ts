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
  public readonly formControls: FormControl[] = new Array(4)
    .fill(0)
    .map(() => new FormControl('', Validators.required));
}
