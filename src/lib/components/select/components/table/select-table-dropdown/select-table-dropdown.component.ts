import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';

import { SelectStateService } from '../../../services/select-state.service';
import { SelectDropdownBase } from './../../../../../../internal/declarations/classes/abstract/select-dropdown-base.abstract';

const ANIMATION_DURATION_MS: number = 150;

@Component({
  selector: 'pupa-select-table-dropdown',
  templateUrl: './select-table-dropdown.component.html',
  styleUrls: ['./select-table-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('dropdownExpanded', [
      state('void', style({ margin: '0', transform: 'translateY(-8px)', opacity: 0 })),
      state('expanded', style({ margin: '4px 0', transform: 'translateY(0)', opacity: 1 })),
      transition('void => expanded', [animate(`${ANIMATION_DURATION_MS}ms ease`)]),
      transition('expanded => void', [animate(`${ANIMATION_DURATION_MS}ms ease`)]),
    ]),
  ],
})
export class SelectTableDropdownComponent<T> extends SelectDropdownBase<T> {
  @ViewChild(CdkConnectedOverlay) protected readonly cdkConnectedOverlay: CdkConnectedOverlay;

  constructor(selectStateService: SelectStateService<T>) {
    super(selectStateService);
  }
}
