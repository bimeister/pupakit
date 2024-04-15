import { animate, state, style, transition, trigger } from '@angular/animations';
import { ConnectedOverlayPositionChange, ConnectionPositionPair } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { filterFalsy, filterNotNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, fromEvent, Observable, Subscription, zip } from 'rxjs';
import { distinctUntilChanged, map, take, withLatestFrom } from 'rxjs/operators';
import { TOOLTIP_SERVICE_TOKEN } from '../../../../declarations/tokens/tooltip-service.token';
import { TooltipServiceDeclaration } from '../../../../declarations/interfaces/tooltip-service-declaration.interface';

const OFFSET_REM: number = 1;
const ANIMATION: string = `200ms ease-in-out`;

@Component({
  selector: 'pupa-tooltip-content',
  templateUrl: './tooltip-content.component.html',
  styleUrls: ['./tooltip-content.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('tooltipShow', [
      state('void', style({ opacity: 0 })),
      state('enter', style({ opacity: 1 })),
      transition('* => *', animate(ANIMATION)),
    ]),
  ],
})
export class TooltipContentComponent implements OnDestroy {
  private readonly tooltipService: TooltipServiceDeclaration;
  private readonly tooltipHideOnHoverHover$: Observable<boolean>;
  public readonly tooltipContent$: Observable<Nullable<string>>;
  public readonly tooltipContentTemplate$: Observable<Nullable<TemplateRef<unknown>>>;
  private readonly tooltipPosition$: Observable<ConnectedOverlayPositionChange>;

  private readonly hostElementMouseEnter$: Observable<MouseEvent> = fromEvent<MouseEvent>(
    this.hostElementRef.nativeElement,
    'mouseenter'
  );

  private readonly hostElementMouseLeave$: Observable<MouseEvent> = fromEvent<MouseEvent>(
    this.hostElementRef.nativeElement,
    'mouseleave'
  );

  public readonly styleTransform$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(null);

  private readonly subscription: Subscription = new Subscription();
  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly injector: Injector,
    private readonly hostElementRef: ElementRef<HTMLElement>
  ) {
    this.tooltipService = this.injector.get(TOOLTIP_SERVICE_TOKEN);
    this.tooltipHideOnHoverHover$ = this.tooltipService.tooltipHideOnHoverHover$;
    this.tooltipContent$ = this.tooltipService.tooltipContent$;
    this.tooltipContentTemplate$ = this.tooltipService.tooltipContentTemplate$;
    this.tooltipPosition$ = this.tooltipService.tooltipPosition$;

    this.subscription.add(this.calculateTooltipStyleTransform());
    this.subscription.add(this.processContentMouseEnterEvent());
    this.subscription.add(this.processContentMouseEnterLeave());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private processContentMouseEnterEvent(): Subscription {
    return this.hostElementMouseEnter$
      .pipe(withLatestFrom(this.tooltipHideOnHoverHover$.pipe(take(1), filterFalsy())))
      .subscribe(() => {
        this.tooltipService.processContentMouseEnter();
      });
  }

  private processContentMouseEnterLeave(): Subscription {
    return this.hostElementMouseLeave$.subscribe(() => {
      this.tooltipService.processContentMouseLeave();
    });
  }

  private calculateTooltipStyleTransform(): Subscription {
    return zip(this.getTooltipOffsetXRem(), this.getTooltipOffsetYRem())
      .pipe(
        map(([offsetXRem, offsetYRem]: [number, number]) => `translate(${offsetXRem}rem, ${offsetYRem}rem)`),
        distinctUntilChanged()
      )
      .subscribe((transformStyle: string) => {
        this.styleTransform$.next(transformStyle);
        this.detectChanges();
      });
  }

  private getTooltipOffsetXRem(): Observable<number> {
    return this.tooltipPosition$.pipe(
      filterNotNil(),
      map((tooltipPosition: ConnectedOverlayPositionChange) => tooltipPosition.connectionPair),
      map((connectionPair: ConnectionPositionPair) => {
        switch (connectionPair.overlayX) {
          case 'end':
            return -OFFSET_REM;
          case 'start':
            return OFFSET_REM;
          default:
            return 0;
        }
      })
    );
  }

  private getTooltipOffsetYRem(): Observable<number> {
    return this.tooltipPosition$.pipe(
      filterNotNil(),
      map((tooltipPosition: ConnectedOverlayPositionChange) => tooltipPosition.connectionPair),
      map((connectionPair: ConnectionPositionPair) => {
        switch (connectionPair.overlayY) {
          case 'bottom':
            return -OFFSET_REM;
          case 'top':
            return OFFSET_REM;
          default:
            return 0;
        }
      })
    );
  }

  private detectChanges(): void {
    this.changeDetectorRef.detectChanges();
  }
}
