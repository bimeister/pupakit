import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  GlobalPositionStrategy,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElementRef, Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { getUuid, isNil, Uuid } from '@bimeister/utilities';
import { fromEvent, merge, Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { PopoverContainerComponent } from '../../../lib/components/popover/components/popover-container/popover-container.component';
import { POPOVER_CONTAINER_DATA_TOKEN } from '../../constants/tokens/popover-container-data.token';
import { ClientUiStateHandlerService } from '../../shared/services/client-ui-state-handler.service';
import { PopoverReturnType } from '../api';
import { PopoverConfig } from '../interfaces/popover-config.interface';
import { PopoverContainerData } from '../interfaces/popover-container-data.interface';
import { PortalLayer } from '../interfaces/portal-layer.interface';
import { Position } from '../types/position.type';
import { PopoverDataType } from '../types/utility-types/popover-data.utility-type';
import { PopoverComponentBase } from './api';
import { PopoverRef } from './popover-ref.class';

const OVERLAY_POSITIONS: ConnectionPositionPair[] = [
  new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
  new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
  new ConnectionPositionPair({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' }),
  new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' }),
];

export class Popover<TComponent extends PopoverComponentBase<unknown, unknown>> implements PortalLayer {
  public readonly id: Uuid = getUuid();
  private readonly renderer: Renderer2 = this.rendererFactory.createRenderer(null, null);

  private readonly defaultPosition: FlexibleConnectedPositionStrategy = this.getAnchorPosition();
  private readonly overlayRef: OverlayRef = this.overlay.create({
    positionStrategy: this.defaultPosition,
    hasBackdrop: this.config.hasBackdrop,
  });
  private readonly popoverRef: PopoverRef<PopoverDataType<TComponent>, PopoverReturnType<TComponent>> = new PopoverRef(
    this.overlayRef,
    this.config
  );
  private currentZIndex: number = 0;

  constructor(
    private readonly config: PopoverConfig<TComponent, PopoverDataType<TComponent>>,
    private readonly overlay: Overlay,
    private readonly injector: Injector,
    private readonly rendererFactory: RendererFactory2,
    private readonly clientUiStateHandlerService: ClientUiStateHandlerService,
    private readonly document: Document
  ) {
    this.handleXsBreakpointChange();
    this.listenOutsideEventsForClose();
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

  public open(): PopoverRef<PopoverDataType<TComponent>, PopoverReturnType<TComponent>> {
    this.overlayRef.attach(this.getComponentPortal());
    return this.popoverRef;
  }

  private getAnchorPosition(): FlexibleConnectedPositionStrategy {
    const anchor: ElementRef | Position = this.config.anchor;
    if (anchor instanceof ElementRef) {
      const elementPosition: FlexibleConnectedPositionStrategy = this.overlay
        .position()
        .flexibleConnectedTo(anchor)
        .withPositions(OVERLAY_POSITIONS)
        .withViewportMargin(4);

      return elementPosition;
    }

    const coordsPosition: FlexibleConnectedPositionStrategy = this.overlay
      .position()
      .flexibleConnectedTo({ x: anchor[0], y: anchor[1] })
      .withPositions(OVERLAY_POSITIONS)
      .withViewportMargin(4);

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
      positionChanges$: this.defaultPosition.positionChanges,
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
        if (!breakpointIsXs) {
          this.overlayRef.updatePositionStrategy(this.defaultPosition);
          return;
        }

        const mobilePositionStrategy: GlobalPositionStrategy = this.overlay.position().global().centerHorizontally();
        this.overlayRef.updatePositionStrategy(mobilePositionStrategy);
      });
  }

  private listenOutsideEventsForClose(): void {
    const mouseDown$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'mousedown');
    const touchMove$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'touchmove');
    const wheel$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.document, 'wheel');
    const resize$: Observable<MouseEvent> = fromEvent<MouseEvent>(window, 'resize');

    merge(mouseDown$, touchMove$, wheel$, resize$)
      .pipe(take(1))
      .subscribe(() => this.popoverRef.close());
  }
}
