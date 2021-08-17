import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  ConnectionPositionPair,
  OverlayConnectionPosition
} from '@angular/cdk/overlay';
import { TooltipService } from '../../services/tooltip.service';
import { BehaviorSubject, Observable, Subscription, zip } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { filterFalsy, filterNotNil, isNil, Nullable } from '@bimeister/utilities';
import { animate, state, style, transition, trigger } from '@angular/animations';

const POINTER_WIDTH_PX: number = 4;
const ANIMATION_DURATION_MS: number = 150;

@Component({
  selector: 'pupa-tooltip-content',
  templateUrl: './tooltip-content.component.html',
  styleUrls: ['./tooltip-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('tooltipShow', [
      state('void', style({ opacity: 0 })),
      state('show', style({ opacity: 1 })),
      transition('void => show', [animate(`${ANIMATION_DURATION_MS}ms ease-in`)]),
      transition('show => void', [animate(`${ANIMATION_DURATION_MS}ms ease-in`)])
    ])
  ]
})
export class TooltipContentComponent implements OnInit, OnDestroy {
  @ViewChild('content') public readonly contentRef: TemplateRef<HTMLElement>;

  public readonly overlayPositions: ConnectionPositionPair[] = [
    new ConnectionPositionPair({ originX: 'center', originY: 'top' }, { overlayX: 'center', overlayY: 'bottom' }),
    new ConnectionPositionPair({ originX: 'end', originY: 'center' }, { overlayX: 'start', overlayY: 'center' }),
    new ConnectionPositionPair({ originX: 'center', originY: 'bottom' }, { overlayX: 'center', overlayY: 'top' }),
    new ConnectionPositionPair({ originX: 'start', originY: 'center' }, { overlayX: 'end', overlayY: 'center' }),
    new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' }),
    new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
    new ConnectionPositionPair({ originX: 'end', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
    new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' })
  ];

  private readonly subscription: Subscription = new Subscription();

  public readonly dropDownOverlayOrigin$: Observable<CdkOverlayOrigin> = this.tooltipService.tooltipOverlayOrigin$;
  public readonly isOpened$: Observable<boolean> = this.tooltipService.isOpened$;

  private readonly currentOverlayPosition$: BehaviorSubject<Nullable<OverlayConnectionPosition>> = new BehaviorSubject<
    Nullable<OverlayConnectionPosition>
  >(null);

  public readonly positionIsReady$: Observable<boolean> = this.currentOverlayPosition$.pipe(
    map((currentOverlayPosition: Nullable<OverlayConnectionPosition>) => !isNil(currentOverlayPosition))
  );
  public readonly animationState$: Observable<'void' | 'show'> = this.positionIsReady$.pipe(
    map((positionIsReady: boolean) => (positionIsReady ? 'show' : 'void'))
  );

  private readonly offsetXPx$: Observable<number> = this.currentOverlayPosition$.pipe(
    filterNotNil(),
    map((currentOverlayPosition: OverlayConnectionPosition) => {
      switch (currentOverlayPosition.overlayX) {
        case 'end':
          return -POINTER_WIDTH_PX;
        case 'start':
          return POINTER_WIDTH_PX;
        default:
          return 0;
      }
    })
  );

  private readonly offsetYPx$: Observable<number> = this.currentOverlayPosition$.pipe(
    filterNotNil(),
    map((currentOverlayPosition: OverlayConnectionPosition) => {
      switch (currentOverlayPosition.overlayY) {
        case 'bottom':
          return -POINTER_WIDTH_PX;
        case 'top':
          return POINTER_WIDTH_PX;
        default:
          return 0;
      }
    })
  );

  public readonly styleTransform$: Observable<string> = zip(this.offsetXPx$, this.offsetYPx$).pipe(
    map(([offsetXPx, offsetYPx]: [number, number]) => `translate(${offsetXPx}px, ${offsetYPx}px)`)
  );

  constructor(private readonly tooltipService: TooltipService, private readonly changeDetectorRef: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.subscription.add(this.resetPositionOnTooltipHide());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public processMouseEnterEvent(): void {
    this.tooltipService.hideOnTooltipHover$
      .pipe(take(1), filterFalsy())
      .subscribe(() => this.tooltipService.processContentMouseEnter());
  }

  public processMouseLeaveEvent(): void {
    this.tooltipService.processContentMouseLeave();
  }

  public processPositionChange(event: ConnectedOverlayPositionChange): void {
    this.currentOverlayPosition$.next({
      overlayX: event.connectionPair.overlayX,
      overlayY: event.connectionPair.overlayY
    });
    this.changeDetectorRef.detectChanges();
  }

  private resetPositionOnTooltipHide(): Subscription {
    return this.isOpened$.pipe(filterFalsy()).subscribe(() => this.currentOverlayPosition$.next(null));
  }
}
