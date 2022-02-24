import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-stepper-example-2',
  templateUrl: './example-2.component.html',
  styleUrls: ['./example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperExample2Component {}
