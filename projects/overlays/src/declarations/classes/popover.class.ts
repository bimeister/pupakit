import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  GlobalPositionStrategy,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElementRef, Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { ClientUiStateHandlerService, OVERLAY_VIEWPORT_MARGIN_PX, Position } from '@bimeister/pupakit.common';
import { Uuid, getUuid, isNil } from '@bimeister/utilities';
import { Observable, Subscription, fromEvent, merge, of } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { PopoverContainerComponent } from '../../components/popover/components/popover-container/popover-container.component';
import { PopoverConfig } from '../interfaces/popover-config.interface';
import { PopoverContainerData } from '../interfaces/popover-container-data.interface';
import { PortalLayer } from '../interfaces/portal-layer.interface';
import { POPOVER_CONTAINER_DATA_TOKEN } from '../tokens/popover-container-data.token';
import { PopoverDataType } from '../types/utility-types/popover-data.utility-type';
import { PopoverReturnType } from '../types/utility-types/popover-return.utility-type';
import { PopoverComponentBase } from './abstract/popover-component-base.abstract';
import { PopoverRef } from './popover-ref.class';
import { NavigationStart, Router } from '@angular/router';

const OVERLAY_OFFSET_Y: number = 8;
const OVERLAY_POSITIONS: ConnectionPositionPair[] = [
  new ConnectionPositionPair(
    { originX: 'start', originY: 'bottom' },
    { overlayX: 'start', overlayY: 'top' },
    0,
    OVERLAY_OFFSET_Y
  ),
  new ConnectionPositionPair(
    { originX: 'start', originY: 'top' },
    { overlayX: 'start', overlayY: 'bottom' },
    0,
    -OVERLAY_OFFSET_Y
  ),
  new ConnectionPositionPair(
    { originX: 'end', originY: 'bottom' },
    { overlayX: 'end', overlayY: 'top' },
    0,
    OVERLAY_OFFSET_Y
  ),
  new ConnectionPositionPair(
    { originX: 'end', originY: 'top' },
    { overlayX: 'end', overlayY: 'bottom' },
    0,
    -OVERLAY_OFFSET_Y
  ),
];
enum NavigationTriggerEvents {
  POPSTATE = 'popstate',
}
type CloseEvent = MouseEvent | TouchEvent | WheelEvent | Event | null | NavigationStart;

export class Popover<TComponent extends PopoverComponentBase<unknown, unknown>> implements PortalLayer {
  public readonly id: Uuid = getUuid();
  private readonly renderer: Renderer2 = this.rendererFactory.createRenderer(null, null);
  private readonly outsideEventsSubscription: Subscription = new Subscription();
  private readonly positionStrategy: FlexibleConnectedPositionStrategy = this.getAnchorPosition();
  private readonly overlayRef: OverlayRef = this.overlay.create({
    positionStrategy: this.positionStrategy,
    hasBackdrop: this.config.hasBackdrop,
  });
  private readonly popoverRef: PopoverRef<PopoverDataType<TComponent>, PopoverReturnType<TComponent>> = new PopoverRef(
    this.overlayRef,
    this.config
  );
  private currentZIndex: number = 0;
  private popoverAutoCloseTimeout: number;
  constructor(
    private readonly config: PopoverConfig<TComponent, PopoverDataType<TComponent>>,
    private readonly overlay: Overlay,
    private readonly injector: Injector,
    private readonly rendererFactory: RendererFactory2,
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService,
    private readonly document: Document,
    private readonly router: Router
  ) {
    this.handleXsBreakpointChange();
    this.outsideEventsSubscription.add(this.listenOutsideEventsForCloseProcess());
    this.outsideEventsSubscription.add(this.popoverRefClosingProcess());
    if (!isNil(this.config.autoCloseTimeout)) {
      this.outsideEventsSubscription.add(this.processOverlayEvents());
    }
  }

  public updateOverlayPosition(): void {
    this.positionStrategy.apply();
  }

  public getCurrentZIndex(): number {
    return this.currentZIndex;
  }

  public moveToZIndex(zIndex: number): void {
    if (isNil(this.overlayRef.hostElement)) {
      return;
    }
    this.currentZIndex = zIndex;
    this.renderer.setStyle(this.overlayRef.hostElement, 'z-index', zIndex);

    const backdropElement: HTMLElement | null = this.overlayRef.backdropElement;
    if (!isNil(backdropElement)) {
      this.renderer.setStyle(backdropElement, 'z-index', zIndex);
    }
  }

  public open(fromCache: boolean = false): PopoverRef<PopoverDataType<TComponent>, PopoverReturnType<TComponent>> {
    if (!fromCache) {
      this.overlayRef.attach(this.getComponentPortal());
    }
    return this.popoverRef;
  }

  private getAnchorPosition(): FlexibleConnectedPositionStrategy {
    const anchor: ElementRef | Position = this.config.anchor;
    if (anchor instanceof ElementRef) {
      const elementPosition: FlexibleConnectedPositionStrategy = this.overlay
        .position()
        .flexibleConnectedTo(anchor)
        .withGrowAfterOpen(true)
        .withPositions(OVERLAY_POSITIONS)
        .withViewportMargin(OVERLAY_VIEWPORT_MARGIN_PX);

      return elementPosition;
    }

    const coordsPosition: FlexibleConnectedPositionStrategy = this.overlay
      .position()
      .flexibleConnectedTo({ x: anchor[0], y: anchor[1] })
      .withPositions(OVERLAY_POSITIONS)
      .withViewportMargin(OVERLAY_VIEWPORT_MARGIN_PX);

    return coordsPosition;
  }

  private getComponentPortal(): ComponentPortal<PopoverContainerComponent> {
    const injector: Injector = Injector.create({
      parent: this.config.injector ?? this.injector,
      providers: [{ provide: PopoverRef, useValue: this.popoverRef }],
    });

    const componentPortal: ComponentPortal<unknown> = new ComponentPortal<unknown>(
      this.config.component,
      null,
      injector
    );

    const containerData: PopoverContainerData = {
      componentPortal,
      positionChanges$: this.positionStrategy.positionChanges,
    };

    return new ComponentPortal(
      PopoverContainerComponent,
      null,
      Injector.create({
        providers: [{ provide: POPOVER_CONTAINER_DATA_TOKEN, useValue: containerData }],
      })
    );
  }

  private handleXsBreakpointChange(): void {
    this.clientUiStateHandlerService.breakpointIsXs$
      .pipe(takeUntil(this.popoverRef.closed$))
      .subscribe((breakpointIsXs: boolean) => {
        if (breakpointIsXs) {
          const mobilePositionStrategy: GlobalPositionStrategy = this.overlay.position().global().centerHorizontally();
          this.overlayRef.updatePositionStrategy(mobilePositionStrategy);
          return;
        }

        this.overlayRef.updatePositionStrategy(this.positionStrategy);
      });
  }

  private listenOutsideEventsForCloseProcess(): Subscription {
    const mouseDown$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'mousedown');
    const touchMove$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'touchmove');
    const wheel$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'wheel');
    const resize$: Observable<MouseEvent> = fromEvent<MouseEvent>(window, 'resize');
    const routerEvents$: Observable<NavigationStart> = this.router.events.pipe(
      filter((event: NavigationStart) => event.navigationTrigger === NavigationTriggerEvents.POPSTATE)
    );
    let anchorMouseEnter$: Observable<Event | null> = of(null);
    if (this.config.anchor instanceof ElementRef) {
      anchorMouseEnter$ = fromEvent(this.config.anchor.nativeElement, 'mouseenter');
    }

    return merge(anchorMouseEnter$, mouseDown$, touchMove$, wheel$, resize$, routerEvents$)
      .pipe(filter((event: CloseEvent) => !isNil(event)))
      .subscribe((event: NonNullable<CloseEvent>) => {
        if (event instanceof NavigationStart || event.type === 'resize') {
          this.popoverRef.close();
          return;
        }
        const eventTarget: HTMLElement = event.target as HTMLElement;

        if (this.isContainsElementOnAnchor(eventTarget)) {
          return;
        }

        this.popoverRef.close();
      });
  }

  private popoverRefClosingProcess(): Subscription {
    return this.popoverRef.closed$.subscribe(() => this.outsideEventsSubscription.unsubscribe());
  }
  private startAutoCloseTimer(): void {
    if (!isNil(this.popoverAutoCloseTimeout)) {
      clearTimeout(this.popoverAutoCloseTimeout);
    }

    this.popoverAutoCloseTimeout = window.setTimeout(() => {
      this.popoverRef.close();
    }, this.config.autoCloseTimeout);
  }

  private isContainsElementOnAnchor(htmlElement: HTMLElement): boolean {
    if (this.config.anchor instanceof ElementRef) {
      const anchorElement: HTMLElement = this.config.anchor.nativeElement;
      clearTimeout(this.popoverAutoCloseTimeout);
      return anchorElement.contains(htmlElement);
    }
    return false;
  }

  private processOverlayEvents(): Subscription {
    const overlayLeaveEvent$: Observable<Event> = fromEvent(this.overlayRef.overlayElement, 'mouseleave');
    const overlayEnterEvent$: Observable<Event> = fromEvent(this.overlayRef.overlayElement, 'mouseenter');
    let triggerLeaveEvent$: Observable<Event>;
    if (this.config.anchor instanceof ElementRef) {
      triggerLeaveEvent$ = fromEvent(this.config.anchor.nativeElement, 'mouseleave');
    }

    return merge(overlayLeaveEvent$, overlayEnterEvent$, triggerLeaveEvent$).subscribe((event: Event) => {
      event.type === 'mouseenter' ? clearTimeout(this.popoverAutoCloseTimeout) : this.startAutoCloseTimer();
    });
  }
}
