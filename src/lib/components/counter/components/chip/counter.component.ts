import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CountColor } from '../../../../../internal/declarations/types/count-color.type';

@Component({
  selector: 'pupa-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent {
  @Input() public count: number;

  @Input() public color: CountColor = 'normal';
}
