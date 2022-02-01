import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-stepper-example-4',
  templateUrl: './example-4.component.html',
  styleUrls: ['./example-4.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperExample4Component {}
