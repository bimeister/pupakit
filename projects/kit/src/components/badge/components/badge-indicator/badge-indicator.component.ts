import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { BadgeIndicatorState } from '../../../../declarations/types/badge-indicator-state.type';

@Component({
  selector: 'pupa-badge-indicator',
  templateUrl: './badge-indicator.component.html',
  styleUrls: ['./badge-indicator.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeIndicatorComponent {
  @Input() public readonly state: BadgeIndicatorState = 'progress';

  public readonly icons: Map<BadgeIndicatorState, string> = new Map([
    ['complete', 'app-exceptions-check-4'],
    ['error', 'app-exceptions-cross-4'],
  ]);
}
