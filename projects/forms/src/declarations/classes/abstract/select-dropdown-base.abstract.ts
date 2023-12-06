import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectionPositionPair, OverlayRef } from '@angular/cdk/overlay';
import { Directive, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { filterNotNil, filterTruthy, isNil, Nullable } from '@bimeister/utilities';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { SelectStateServiceDeclaration } from '../../interfaces/select-state-service-declaration.interface';
import { ComponentChange, ComponentChanges } from '@bimeister/pupakit.common';

@Directive()
export abstract class SelectDropdownBase<T> implements OnInit, OnChanges, OnDestroy {
  protected abstract readonly cdkConnectedOverlay: CdkConnectedOverlay;
  public abstract minBottomViewportDistance: number | null;

  public readonly viewportMargin: number = this.selectStateService.viewportMargin;

  private readonly subscription: Subscription = new Subscription();

  public readonly isExpanded$: Observable<boolean> = this.selectStateService.isExpanded$;
  public readonly animationState$: Observable<string> = this.isExpanded$.pipe(
    distinctUntilChanged(),
    map((isExpanded: boolean) => (isExpanded ? 'expanded' : 'void'))
  );

  public readonly dropDownOverlayOrigin$: Observable<CdkOverlayOrigin> =
    this.selectStateService.dropdownOverlayOrigin$.pipe(filter((origin: CdkOverlayOrigin) => !isNil(origin)));

  public readonly dropDownTriggerWidthPx$: Observable<number | undefined> = this.isExpanded$.pipe(
    filter((isExpanded: boolean) => isExpanded),
    switchMap(() => this.selectStateService.dropdownTriggerWidthPx$)
  );

  public readonly overlayPositions$: Observable<ConnectionPositionPair[]> = this.selectStateService.overlayPositions$;

  public readonly isOverlayAttached$: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(private readonly selectStateService: SelectStateServiceDeclaration<T>) {}

  public ngOnInit(): void {
    this.subscription.add(this.handleOverlayRefOnOpen());
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (changes.hasOwnProperty('minBottomViewportDistance')) {
      this.processMinBottomViewportDistanceChanges(changes.minBottomViewportDistance);
    }
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

  public handleOutsideClick(): void {
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

  private processMinBottomViewportDistanceChanges(change: ComponentChange<this, number | null>): void {
    const currentValue: Nullable<number> = change.currentValue;

    if (isNil(currentValue)) {
      return;
    }

    this.selectStateService.setMinBottomViewportDistance(currentValue);
  }
}
