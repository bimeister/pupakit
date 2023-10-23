import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import {
  appAttentionFilledIcon,
  appCheckRoundFilledIcon,
  appErrorFilledIcon,
  appInfoFilledIcon,
} from '@bimeister/pupakit.icons';
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
  @Input() public variant: CalloutType = 'info';
  @Input() public isClosable: boolean = false;

  public readonly isShown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public readonly icons: Map<CalloutType, string> = new Map<CalloutType, string>([
    ['info', appInfoFilledIcon.name],
    ['success', appCheckRoundFilledIcon.name],
    ['warning', appAttentionFilledIcon.name],
    ['danger', appErrorFilledIcon.name],
  ]);

  public closeCallout(): void {
    this.isShown$.next(false);
  }
}
