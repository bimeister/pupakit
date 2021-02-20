import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pupa-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent {
  @Input() public count: number;
}
