import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-stepper-counter',
  templateUrl: './stepper-counter.component.html',
  styleUrls: ['./stepper-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class StepperCounterComponent {
  @Input() public stepCount: number = 1;

  @Input() public disabled: boolean = false;
  @Input() public active: boolean = false;
}
