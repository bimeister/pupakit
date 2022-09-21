import {
  ConnectedOverlayPositionChange,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElementRef, Injectable, Injector, OnDestroy, TemplateRef } from '@angular/core';
import { filterNotNil, Nullable, shareReplayWithRefCount } from '@bimeister/utilities';
import { OVERLAY_VIEWPORT_MARGIN_PX } from '../../../../internal/constants/overlay-viewport-margin-px.const';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, take } from 'rxjs/operators';
import { TOOLTIP_SERVICE_TOKEN } from '../../../../internal/constants/tokens/tooltip-service.token';
import { TooltipService as ServiceInterface } from '../../../../internal/declarations/interfaces/tooltip-service.interface';
import { TooltipContentComponent } from '../components/tooltip-content/tooltip-content.component';
import { OVERLAY_POSITIONS } from '../positions';

@Injectable()
export class TooltipService implements OnDestroy, ServiceInterface {
  private readonly subscription: Subscription = new Subscription();

  private readonly mouseOverTrigger$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly mouseOverContent$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private readonly mouseOverTooltip$: Observable<boolean> = combineLatest([
    this.mouseOverTrigger$.pipe(distinctUntilChanged()),
    this.mouseOverContent$.pipe(distinctUntilChanged()),
  ]).pipe(
    debounceTime(0),
    map(([mouseOverTrigger, mouseOverContent]: [boolean, boolean]) => mouseOverTrigger || mouseOverContent)
  );

  private readonly isOpenedState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isOpened$: Observable<boolean> = this.isOpenedState$.pipe(distinctUntilChanged());

  private readonly isDisabledState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly isDisabled$: Observable<boolean> = this.isDisabledState$.pipe(distinctUntilChanged());

  private readonly tooltipContentState$: BehaviorSubject<Nullable<string>> = new BehaviorSubject<Nullable<string>>(
    null
  );
  public readonly tooltipContent$: Observable<Nullable<string>> = this.tooltipContentState$.pipe(
    distinctUntilChanged()
  );

  private readonly tooltipContentTemplateState$: BehaviorSubject<Nullable<TemplateRef<unknown>>> = new BehaviorSubject<
    Nullable<TemplateRef<unknown>>
  >(null);
  public readonly tooltipContentTemplate$: Observable<Nullable<TemplateRef<unknown>>> =
    this.tooltipContentTemplateState$.pipe(distinctUntilChanged());

  private readonly tooltipHideOnHoverState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public readonly tooltipHideOnHoverHover$: Observable<boolean> = this.tooltipHideOnHoverState$.pipe(
    distinctUntilChanged()
  );

  private readonly overlayRef$: BehaviorSubject<Nullable<OverlayRef>> = new BehaviorSubject<Nullable<OverlayRef>>(null);
  private readonly triggerRef$: BehaviorSubject<Nullable<ElementRef<HTMLElement>>> = new BehaviorSubject<
    Nullable<ElementRef<HTMLElement>>
  >(null);

  private readonly tooltipPositionStrategy$: BehaviorSubject<Nullable<FlexibleConnectedPositionStrategy>> =
    new BehaviorSubject<Nullable<FlexibleConnectedPositionStrategy>>(null);
  public readonly tooltipPosition$: Observable<ConnectedOverlayPositionChange> = this.tooltipPositionStrategy$.pipe(
    filterNotNil(),
    switchMap((positionStrategy: FlexibleConnectedPositionStrategy) => positionStrategy.positionChanges),
    shareReplayWithRefCount()
  );

  constructor(private readonly overlay: Overlay) {
    this.subscription.add(this.processMouseOverTooltipChanges());
  }

  public ngOnDestroy(): void {
    this.close();
    this.subscription.unsubscribe();
  }

  public registerTooltipTriggerRef(triggerRef: ElementRef<HTMLElement>): void {
    this.triggerRef$.next(triggerRef);
  }

  public setOpenedState(isOpened: boolean): void {
    this.isOpenedState$
      .pipe(
        take(1),
        filter((currentOpenedState: boolean) => currentOpenedState !== isOpened)
      )
      .subscribe(() => (isOpened ? this.open() : this.close()));
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabledState$.next(isDisabled);
  }

  public setTooltipHideOnHoverState(hideOnTooltipHover: boolean): void {
    this.tooltipHideOnHoverState$.next(hideOnTooltipHover);
  }

  public setTooltipContentState(content: string): void {
    this.tooltipContentState$.next(content);
  }

  public setTooltipContentTemplateState(template: TemplateRef<unknown>): void {
    this.tooltipContentTemplateState$.next(template);
  }

  public processTriggerMouseEnter(): void {
    this.mouseOverTrigger$.next(true);
  }

  public processTriggerMouseLeave(): void {
    this.mouseOverTrigger$.next(false);
  }

  public processContentMouseEnter(): void {
    this.mouseOverContent$.next(true);
  }

  public processContentMouseLeave(): void {
    this.mouseOverContent$.next(false);
  }

  private processMouseOverTooltipChanges(): Subscription {
    return this.mouseOverTooltip$.subscribe((mouseOverTooltip: boolean) => {
      this.setOpenedState(mouseOverTooltip);
    });
  }

  private createOverlay(): void {
    this.getPositionStrategy()
      .pipe(take(1), filterNotNil())
      .subscribe((positionStrategy: FlexibleConnectedPositionStrategy) => {
        const overlayConfig: OverlayConfig = new OverlayConfig({
          positionStrategy,
        });
        const overlayRef: OverlayRef = this.overlay.create(overlayConfig);
        this.overlayRef$.next(overlayRef);
        this.tooltipPositionStrategy$.next(positionStrategy);
      });
  }

  private getPositionStrategy(): Observable<FlexibleConnectedPositionStrategy> {
    return this.triggerRef$.pipe(
      take(1),
      filterNotNil(),
      map((triggerRef: ElementRef<HTMLElement>) => {
        const positionStrategy: FlexibleConnectedPositionStrategy = this.overlay
          .position()
          .flexibleConnectedTo(triggerRef)
          .withPositions(OVERLAY_POSITIONS)
          .withViewportMargin(OVERLAY_VIEWPORT_MARGIN_PX);

        return positionStrategy;
      })
    );
  }

  private open(): void {
    this.createOverlay();
    this.overlayRef$.pipe(filterNotNil(), take(1)).subscribe((overlayRef: OverlayRef) => {
      overlayRef.attach(this.getComponentPortal());
      overlayRef.updatePosition();

      this.isOpenedState$.next(true);
    });
  }

  private close(): void {
    this.overlayRef$.pipe(filterNotNil(), take(1)).subscribe((overlayRef: OverlayRef) => {
      this.isOpenedState$.next(false);
      overlayRef.dispose();
      overlayRef.detach();
      this.overlayRef$.next(null);
    });
  }

  private getComponentPortal(): ComponentPortal<TooltipContentComponent> {
    const portalInjector: Injector = Injector.create({
      providers: [
        {
          provide: TOOLTIP_SERVICE_TOKEN,
          useValue: this,
        },
      ],
    });
    return new ComponentPortal(TooltipContentComponent, null, portalInjector);
  }
}
