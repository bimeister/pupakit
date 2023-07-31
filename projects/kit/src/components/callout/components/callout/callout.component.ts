import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  @Input() public readonly isClosable: boolean = false;

  public readonly isShown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public readonly icons: Map<CalloutType, string> = new Map<CalloutType, string>([
    ['info', 'app-info-filled'],
    ['success', 'app-check-round-filled'],
    ['warning', 'app-attention-filled'],
    ['danger', 'app-error-filled'],
  ]);

  public closeCallout(): void {
    this.isShown$.next(false);
  }
}
