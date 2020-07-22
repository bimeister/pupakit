import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { isNullOrUndefined } from '../../../../../internal/helpers/is-null-or-undefined.helper';
import { SelectNewStateService } from '../../services/select-new-state.service';

const ANIMATION_DURATION_MS: number = 150;

@Component({
  selector: 'pupa-select-new-dropdown',
  templateUrl: './select-new-dropdown.component.html',
  styleUrls: ['./select-new-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('dropdownExpanded', [
      state('void', style({ height: 0, margin: '0', transform: 'translateY(-8px)' })),
      state('expanded', style({ height: '*', margin: '4px 0', transform: 'translateY(0)' })),
      transition('void => expanded', [animate(`${ANIMATION_DURATION_MS}ms ease`)]),
      transition('expanded => void', [animate(`${ANIMATION_DURATION_MS}ms ease`)])
    ])
  ]
})
export class SelectNewDropdownComponent<T> {
  public readonly isExpanded$: Observable<boolean> = this.selectNewStateService.isExpanded$;
  public readonly animationState$: Observable<string> = this.isExpanded$.pipe(
    distinctUntilChanged(),
    map((isExpanded: boolean) => (isExpanded ? 'expanded' : 'void'))
  );

  public readonly dropDownOverlayOrigin$: Observable<
    CdkOverlayOrigin
  > = this.selectNewStateService.dropDownOverlayOrigin$.pipe(
    filter((origin: CdkOverlayOrigin) => !isNullOrUndefined(origin))
  );

  constructor(private readonly selectNewStateService: SelectNewStateService<T>) {}
}
