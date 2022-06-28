import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, Input, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SelectDropdownBase } from '../../../../../internal/declarations/classes/abstract/select-dropdown-base.abstract';
import { ThemeWrapperService } from '../../../theme-wrapper/services/theme-wrapper.service';
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
      state('expanded', style({ margin: '8px 0', transform: 'translateY(0)', opacity: 1 })),
      transition('void => expanded', [animate(`${ANIMATION_DURATION_MS}ms ease-in`)]),
      transition('expanded => void', [animate(`${ANIMATION_DURATION_MS}ms ease-out`)]),
    ]),
  ],
})
export class SelectDropdownComponent<T> extends SelectDropdownBase<T> {
  @ViewChild(CdkConnectedOverlay) protected readonly cdkConnectedOverlay: CdkConnectedOverlay;
  @Input() public width: string | null = null;

  public readonly themeClass$: Observable<string> = this.themeWrapperService?.themeClass$ ?? of('');
  public readonly theme$: Observable<string> = this.themeWrapperService?.theme$;

  constructor(
    selectStateService: SelectStateService<T>,
    @Optional() private readonly themeWrapperService: ThemeWrapperService
  ) {
    super(selectStateService);
  }
}
