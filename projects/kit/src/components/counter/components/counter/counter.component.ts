import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { CountColor } from '../../../../declarations/types/count-color.type';
import { CounterMode } from '../../../../declarations/types/counter-mode.type';

@Component({
  selector: 'pupa-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class CounterComponent {
  @Input() public count: number;
  @Input() public color: CountColor = 'neutral';
  @Input() public mode: CounterMode = 'default';
}
