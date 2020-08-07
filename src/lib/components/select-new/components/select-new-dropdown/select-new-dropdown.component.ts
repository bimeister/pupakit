import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkOverlayOrigin, ConnectionPositionPair } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, HostListener, ViewEncapsulation } from '@angular/core';
import { isNil } from '@meistersoft/utilities';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { SelectNewStateService } from '../../services/select-new-state.service';

const ANIMATION_DURATION_MS: number = 150;
const CDK_CONNECTED_OVERLAY_VIEWPORT_MARGIN: number = 100;

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
  > = this.selectNewStateService.dropDownOverlayOrigin$.pipe(filter((origin: CdkOverlayOrigin) => !isNil(origin)));

  public readonly dropDownTriggerButtonWidthPx$: Observable<number> = this.isExpanded$.pipe(
    filter((isExpanded: boolean) => isExpanded),
    switchMap(() => this.selectNewStateService.dropDownTriggerButtonWidthPx$)
  );

  public readonly overlayPositions: ConnectionPositionPair[] = [
    new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
    new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' })
  ];
  public readonly overlayViewportMargin: number = CDK_CONNECTED_OVERLAY_VIEWPORT_MARGIN;

  constructor(private readonly selectNewStateService: SelectNewStateService<T>) {}

  @HostListener('window:resize')
  public processWindowResizeEvent(): void {
    this.selectNewStateService.collapse();
  }
}
