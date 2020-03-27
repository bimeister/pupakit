import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

import { ExpanderBehavior } from '../../../../../internal/declarations/types/expander-behavior.type';
import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';

const CURSOR_BY_BEHAVIOR_NAME: Map<ExpanderBehavior, string> = new Map<ExpanderBehavior, string>([
  ['top', 'n-resize'],
  ['right', 'e-resize'],
  ['bottom', 's-resize'],
  ['left', 'w-resize'],
  ['right-top', 'ne-resize'],
  ['right-bottom', 'se-resize'],
  ['left-bottom', 'sw-resize'],
  ['left-top', 'nw-resize'],
  ['vertical', 'ns-resize'],
  ['horizontal', 'ew-resize']
]);

/** @dynamic */
@Component({
  selector: 'pupa-expander',
  templateUrl: './expander.component.html',
  styleUrls: ['./expander.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpanderComponent implements OnChanges {
  @Input() public behavior: ExpanderBehavior;
  @HostBinding('style.cursor') public cursorName: string;

  public ngOnChanges(changes: SimpleChanges): void {
    if (isNullOrUndefined(changes)) {
      return;
    }
    this.processBehaviorChanges(changes?.behavior);
  }

  private processBehaviorChanges(change: SimpleChange): void {
    if (isNullOrUndefined(change)) {
      return;
    }
    const targetCursorName: string = CURSOR_BY_BEHAVIOR_NAME.get(change?.currentValue);
    if (isNullOrUndefined(targetCursorName)) {
      return;
    }
    this.cursorName = targetCursorName;
  }
}
