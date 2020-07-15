import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { filter, mapTo, switchMap, take } from 'rxjs/operators';

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
      state('void', style({ height: 0 })),
      state('expanded', style({ height: '*' })),
      transition('* => *', [animate(`${ANIMATION_DURATION_MS}ms ease-in`)])
    ])
  ]
})
export class SelectNewDropdownComponent {
  public readonly isExpanded$: Observable<boolean> = this.selectNewStateService.isExpanded$;
  public readonly isVisible$: Observable<boolean> = this.isExpanded$.pipe(
    switchMap((isExpanded: boolean) =>
      isExpanded ? of(isExpanded) : timer(ANIMATION_DURATION_MS).pipe(take(1), mapTo(isExpanded))
    )
  );
  public readonly dropDownOverlayOrigin$: Observable<
    CdkOverlayOrigin
  > = this.selectNewStateService.dropDownOverlayOrigin$.pipe(
    filter((origin: CdkOverlayOrigin) => !isNullOrUndefined(origin))
  );

  constructor(private readonly selectNewStateService: SelectNewStateService) {}
}
