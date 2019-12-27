import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { VOID } from './../../../constants/void.const';

@Component({
  selector: 'pupa-chip-tabs',
  templateUrl: './chip-tabs.component.html',
  styleUrls: ['./chip-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChipTabsComponent {
  public readonly selectedTab$: BehaviorSubject<unknown> = new BehaviorSubject<unknown>(VOID);
}
