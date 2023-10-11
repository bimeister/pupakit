import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { SelectDropdownBase } from '../../../../declarations/classes/abstract/select-dropdown-base.abstract';
import { SelectStateService } from '../../services/select-state.service';

const ANIMATION_DURATION_MS: number = 150;

@Component({
  selector: 'pupa-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('dropdownExpanded', [
      state('void', style({ margin: '0', transform: 'translateY(10px)', opacity: 0 })),
      state('expanded', style({ transform: 'translateY(0)', opacity: 1 })),
      transition('void => expanded', [animate(`${ANIMATION_DURATION_MS}ms ease-in`)]),
      transition('expanded => void', [animate(`${ANIMATION_DURATION_MS}ms ease-out`)]),
    ]),
  ],
})
export class SelectDropdownComponent<T> extends SelectDropdownBase<T> {
  @ViewChild(CdkConnectedOverlay) protected readonly cdkConnectedOverlay: CdkConnectedOverlay;
  @Input() public width: string | null = null;
  @Input() public minHeight: number | null = null;

  constructor(selectStateService: SelectStateService<T>) {
    super(selectStateService);
  }
}
