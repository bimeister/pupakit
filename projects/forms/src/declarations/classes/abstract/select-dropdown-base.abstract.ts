import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectionPositionPair, OverlayRef } from '@angular/cdk/overlay';
import { Directive, OnDestroy, OnInit } from '@angular/core';
import { filterNotNil, filterTruthy, isNil } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { SelectStateServiceDeclaration } from '../../interfaces/select-state-service-declaration.interface';

@Directive()
export abstract class SelectDropdownBase<T> implements OnInit, OnDestroy {
  protected abstract readonly cdkConnectedOverlay: CdkConnectedOverlay;

  private readonly subscription: Subscription = new Subscription();

  public readonly isExpanded$: Observable<boolean> = this.selectStateService.isExpanded$;
  public readonly animationState$: Observable<string> = this.isExpanded$.pipe(
    distinctUntilChanged(),
    map((isExpanded: boolean) => (isExpanded ? 'expanded' : 'void'))
  );

  public readonly dropDownOverlayOrigin$: Observable<CdkOverlayOrigin> =
    this.selectStateService.dropdownOverlayOrigin$.pipe(filter((origin: CdkOverlayOrigin) => !isNil(origin)));

  public readonly dropDownTriggerButtonWidthPx$: Observable<number> = this.isExpanded$.pipe(
    filter((isExpanded: boolean) => isExpanded),
    switchMap(() => this.selectStateService.dropdownTriggerButtonWidthPx$)
  );

  public readonly overlayPositions: ConnectionPositionPair[] = [
    new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
    new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
    new ConnectionPositionPair({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' }),
    new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' }),
  ];

  public readonly isOverlayAttached$: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(private readonly selectStateService: SelectStateServiceDeclaration<T>) {}

  public ngOnInit(): void {
    this.subscription.add(this.handleOverlayRefOnOpen());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public processEventPropagation(event: Event): void {
    event.stopPropagation();
  }

  public handleAttachOverlay(): void {
    this.isOverlayAttached$.next(true);
  }

  public handleDetachOverlay(): void {
    this.isOverlayAttached$.next(false);
  }

  public handleOutsideClick(event: MouseEvent): void {
    this.processEventPropagation(event);
    this.selectStateService.collapse();
  }

  private handleOverlayRefOnOpen(): Subscription {
    return combineLatest([this.isExpanded$, this.isOverlayAttached$.pipe(filterNotNil())])
      .pipe(
        map(([isExpanded, isOverlayAttached]: boolean[]) => isExpanded && isOverlayAttached),
        filterTruthy(),
        map(() => this.cdkConnectedOverlay.overlayRef)
      )
      .subscribe((overlayRef: OverlayRef) => {
        this.selectStateService.defineDropdownOverlayRef(overlayRef);
      });
  }
}
