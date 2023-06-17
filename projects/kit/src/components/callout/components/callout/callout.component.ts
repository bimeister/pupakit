import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

type CalloutType = 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'pupa-callout',
  templateUrl: './callout.component.html',
  styleUrls: ['./callout.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PupaCalloutComponent {
  @Input() public readonly variant: CalloutType = 'info';

  public readonly icons: Map<CalloutType, string> = new Map<CalloutType, string>([
    ['info', 'app-info-filled'],
    ['success', 'app-check-round-filled'],
    ['warning', 'app-attention-filled'],
    ['danger', 'app-error-filled'],
  ]);
}
