import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

type InfoBlockType = 'info' | 'note' | 'success' | 'warning' | 'error';

@Component({
  selector: 'pupa-info-block',
  templateUrl: './info-block.component.html',
  styleUrls: ['./info-block.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoBlockComponent {
  @Input() public readonly variant: InfoBlockType = 'info';

  public readonly icons: Map<InfoBlockType, string> = new Map([
    ['info', 'ios-information-circle'],
    ['note', 'ios-paper'],
    ['success', 'ios-checkmark-circle'],
    ['warning', 'ios-warning'],
    ['error', 'ios-close-circle']
  ]);
}
