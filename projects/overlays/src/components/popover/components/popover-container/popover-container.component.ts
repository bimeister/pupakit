import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { ConnectedOverlayPositionChange, ConnectionPositionPair } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { isEqual } from '@bimeister/utilities/common';
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { POPOVER_CONTAINER_DATA_TOKEN } from '../../../../declarations/tokens/popover-container-data.token';
import { PopoverContainerData } from '../../../../declarations/interfaces/popover-container-data.interface';
import { ClientUiStateHandlerService } from '@bimeister/pupakit.common';

type PointerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type PopoverAnimationState = 'void' | 'showDesktop' | 'showMobile';

const ANIMATION: string = '400ms cubic-bezier(0.25, 0.8, 0.25, 1)';

@Component({
  selector: 'pupa-popover-container',
  templateUrl: './popover-container.component.html',
  styleUrls: ['./popover-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('popoverShow', [
      transition('void => showDesktop', [
        animate(
          ANIMATION,
          keyframes([
            style({ transform: 'translateY(10px)', opacity: 0 }),
            style({ transform: 'translateY(0px)', opacity: 1 }),
          ])
        ),
      ]),
      transition('void => showMobile', [
        animate(
          ANIMATION,
          keyframes([
            style({ transform: 'translate(0, 100%)', opacity: 0 }),
            style({ transform: 'translate(0, 0)', opacity: 1 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class PopoverContainerComponent {
  public readonly componentPortal: ComponentPortal<unknown> = this.componentData.componentPortal;

  public readonly isMobile$: Observable<boolean> = this.clientUiStateHandlerService.breakpointIsXs$;

  public readonly animationState$: BehaviorSubject<PopoverAnimationState> = new BehaviorSubject<PopoverAnimationState>(
    'void'
  );

  private readonly pointerPosition$: ReplaySubject<PointerPosition> = new ReplaySubject<PointerPosition>(1);

  public readonly pointerClassName$: Observable<string> = this.pointerPosition$.pipe(
    map((pointerPosition: PointerPosition) => `pointer__${pointerPosition}`)
  );

  private readonly positionChanges$: Observable<ConnectedOverlayPositionChange> = this.componentData.positionChanges$;

  private readonly subscription: Subscription = new Subscription();

  constructor(
    @Inject(POPOVER_CONTAINER_DATA_TOKEN) private readonly componentData: PopoverContainerData,
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService
  ) {
    this.subscription.add(this.onBreakpointChange());
    this.subscription.add(this.onPositionChange());
  }

  public stopEvent(event: Event): void {
    event.stopPropagation();
  }

  private onPositionChange(): Subscription {
    return this.positionChanges$.subscribe((newPosition: ConnectedOverlayPositionChange) => {
      const pointerPosition: PointerPosition = this.getPointerPositionByConnectionPair(newPosition.connectionPair);
      this.pointerPosition$.next(pointerPosition);
    });
  }

  private getPointerPositionByConnectionPair(connectionPair: ConnectionPositionPair): PointerPosition {
    const pointerPositionTuples: [PointerPosition, ConnectionPositionPair][] = [
      [
        'top-left',
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
      ],
      [
        'bottom-left',
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
        },
      ],
      [
        'top-right',
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        },
      ],
      [
        'bottom-right',
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
        },
      ],
    ];

    const [pointerPosition]: [PointerPosition, ConnectionPositionPair] = pointerPositionTuples.find(
      ([_, positionPair]: [PointerPosition, ConnectionPositionPair]) => isEqual(positionPair, connectionPair)
    );

    return pointerPosition;
  }

  private onBreakpointChange(): Subscription {
    return this.clientUiStateHandlerService.breakpointIsXs$.subscribe((isMobile: boolean) =>
      isMobile ? this.animationState$.next('showMobile') : this.animationState$.next('showDesktop')
    );
  }
}
