import { FlexibleConnectedPositionStrategy, Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { getUuid, isNil } from '@bimeister/utilities';
import { ModalContainerComponent } from '../../components/modal/components/modal-container/modal-container.component';
import { MODAL_CONTAINER_DATA_TOKEN } from '../tokens/modal-container-data.token';
import { ModalConfig } from '../interfaces/modal-config.interface';
import { ModalContainerData } from '../interfaces/modal-container-data.interface';
import { PortalLayer } from '../interfaces/portal-layer.interface';
import { ModalRef } from './modal-ref.class';
import { Position } from '@bimeister/pupakit.common';
import { observeOn, skip, take } from 'rxjs/operators';
import { animationFrameScheduler, Subscription } from 'rxjs';
import { PupaModalViewportBoundaryPositionStrategy } from './pupa-modal-viewport-boundary-position-strategy.class';
import { ModalPositionStrategyBuilder } from '../../services/modal-position-strategy.builder';

export class Modal<ComponentT> implements PortalLayer {
  public readonly id: string = getUuid();
  private readonly renderer: Renderer2 = this.rendererFactory.createRenderer(null, null);

  private readonly overlayRef: OverlayRef = this.overlay.create({
    hasBackdrop: true,
    backdropClass: this.getBackdropClass(),
    positionStrategy: this.getPositionStrategy(),
  });

  private readonly modalRef: ModalRef = new ModalRef(this.id, this.overlayRef, this.config);
  private currentZIndex: number = 0;
  private lastPosition: Position | null = null;

  private readonly subscription: Subscription = new Subscription();

  constructor(
    private readonly component: ComponentType<ComponentT>,
    private readonly config: ModalConfig,
    private readonly overlay: Overlay,
    private readonly injector: Injector,
    private readonly rendererFactory: RendererFactory2,
    private readonly modalPositionStrategyBuilder: ModalPositionStrategyBuilder
  ) {
    this.handleBackdropClick();
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

  public open(): ModalRef {
    if (this.config.isFullscreen) {
      this.modalRef.changeFullscreenMode(this.config.isFullscreen);
    }
    this.overlayRef.attach(this.getComponentPortal());
    this.modalRef.opened$.next();
    this.modalRef.opened$.complete();

    this.initModal();

    return this.modalRef;
  }

  public updatePosition(position: Position | null): void {
    this.modalRef.isFullscreen$.pipe(take(1)).subscribe((isFullscreen: boolean) => {
      if (!isFullscreen) {
        this.lastPosition = position;
      }

      const offsetPosition: Position = this.getOffsetPosition(position);

      if (isNil(this.config.viewport)) {
        const positionStrategy: PositionStrategy = this.getFlexibleConnectedPositionStrategy(offsetPosition);
        // This line needs to update class inside config
        this.overlayRef.getConfig().positionStrategy = positionStrategy;
        this.overlayRef.updatePositionStrategy(positionStrategy);
        return;
      }

      const positionStrategy: PositionStrategy = this.overlayRef.getConfig().positionStrategy;
      if (this.isPupaModalViewportBoundaryPositionStrategy(positionStrategy)) {
        positionStrategy.updatePortalPositionWithClientMouseCoordinates(offsetPosition);
      }
    });
  }

  private initModal(): void {
    this.modalRef.closed$.pipe(take(1)).subscribe(() => {
      this.subscription.unsubscribe();
    });

    this.subscription.add(this.getFullscreenSubscription());
  }

  private getFullscreenSubscription(): Subscription {
    return this.modalRef.isFullscreen$
      .pipe(skip(1), observeOn(animationFrameScheduler))
      .subscribe((isFullscreen: boolean) => {
        const positionStrategy: PositionStrategy = this.overlayRef.getConfig().positionStrategy;
        if (
          !this.isPupaModalViewportBoundaryPositionStrategy(positionStrategy) &&
          !this.isFlexibleConnectedPositionStrategy(positionStrategy)
        ) {
          return;
        }

        if (isFullscreen) {
          this.updatePosition(null);
          return;
        }

        this.updatePosition(this.lastPosition);
      });
  }

  private isPupaModalViewportBoundaryPositionStrategy(
    strategy: PositionStrategy
  ): strategy is PupaModalViewportBoundaryPositionStrategy {
    return strategy instanceof PupaModalViewportBoundaryPositionStrategy;
  }

  private isFlexibleConnectedPositionStrategy(
    strategy: PositionStrategy
  ): strategy is FlexibleConnectedPositionStrategy {
    return strategy instanceof FlexibleConnectedPositionStrategy;
  }

  private getPositionStrategy(): PositionStrategy {
    this.lastPosition = this.config.position;

    if (isNil(this.config.viewport) && isNil(this.config.position)) {
      return this.overlay.position().global().centerHorizontally().centerVertically();
    }
    if (!isNil(this.config.viewport)) {
      return this.getPupaModalViewportBoundaryPositionStrategy();
    }

    return this.getFlexibleConnectedPositionStrategy(this.config.position);
  }

  private getPupaModalViewportBoundaryPositionStrategy(): PositionStrategy {
    return this.modalPositionStrategyBuilder
      .pupaModalViewportBoundary(this.config.viewport)
      .setDefaultLocalPosition(this.config.position)
      .setAlignment({
        overlayX: this.config.overlayX ?? 'center',
        overlayY: this.config.overlayY ?? 'center',
      })
      .setViewportPadding(this.config.viewportMarginPx);
  }

  private getFlexibleConnectedPositionStrategy(position: Position): PositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo({ x: position?.[0] ?? 0, y: position?.[1] ?? 0 })
      .withPush(true)
      .withViewportMargin(this.config.viewportMarginPx)
      .withPositions([
        {
          originX: 'start',
          originY: 'top',
          overlayX: this.config.overlayX ?? 'start',
          overlayY: this.config.overlayY ?? 'top',
        },
      ]);
  }

  private getComponentPortal(): ComponentPortal<ModalContainerComponent<unknown>> {
    const portalInjector: Injector = this.createModalContainerInjector();

    return new ComponentPortal(ModalContainerComponent, null, portalInjector);
  }

  private createModalContainerInjector(): Injector {
    const contentComponentPortal: ComponentPortal<ComponentT> = this.createModalContentComponentPortal();

    const modalContainerData: ModalContainerData<ComponentT> = {
      contentComponentPortal,
    };

    return Injector.create({
      providers: [
        {
          provide: ModalRef,
          useValue: this.modalRef,
        },
        {
          provide: MODAL_CONTAINER_DATA_TOKEN,
          useValue: modalContainerData,
        },
        {
          provide: OverlayRef,
          useValue: this.overlayRef,
        },
      ],
      parent: this.injector,
    });
  }

  private createModalContentComponentPortal(): ComponentPortal<ComponentT> {
    const modalContentInjector: Injector = this.createModalContentInjector();

    return new ComponentPortal(this.component, null, modalContentInjector);
  }

  private createModalContentInjector(): Injector {
    const parentInjector: Injector = this.getParentInjector();

    return Injector.create({
      providers: [
        {
          provide: ModalRef,
          useValue: this.modalRef,
        },
      ],
      parent: parentInjector,
    });
  }

  private getParentInjector(): Injector {
    if (isNil(this.config.injector)) {
      return Injector.create({
        providers: this.config.providers,
        parent: this.injector,
      });
    }

    return Injector.create({
      providers: this.config.providers,
      parent: this.config.injector,
    });
  }

  private handleBackdropClick(): void {
    if (!this.config.closeOnBackdropClick) {
      return;
    }
    this.overlayRef.backdropClick().subscribe(() => this.modalRef.close());
  }

  private getBackdropClass(): string[] {
    const classes: string[] = [];

    if (this.config.hasBackdrop) {
      const backdropClass: string = this.config.isBackdropTransparent
        ? 'cdk-overlay-transparent-backdrop'
        : 'cdk-overlay-dark-backdrop';
      return [...classes, backdropClass];
    }

    return [...classes, 'cdk-overlay-without-backdrop'];
  }

  private getOffsetPosition(position: Position | null): Position | null {
    if (isNil(position)) {
      return null;
    }
    return [position[0] + this.getLeftOffsetByOverlayXPosition(), position[1] + this.getTopOffsetByOverlayYPosition()];
  }

  private getLeftOffsetByOverlayXPosition(): number {
    const targetClientRect: DOMRect = this.modalRef.getOverlayHtmlElement().getBoundingClientRect();

    if (this.isPupaModalViewportBoundaryPositionStrategy(this.overlayRef.getConfig().positionStrategy)) {
      return 0;
    }

    switch (this.modalRef.getOverlayXPosition()) {
      case 'center':
        return targetClientRect.width / 2;
      case 'end':
        return targetClientRect.width;
      case 'start':
      default:
        return 0;
    }
  }

  private getTopOffsetByOverlayYPosition(): number {
    const targetClientRect: DOMRect = this.modalRef.getOverlayHtmlElement().getBoundingClientRect();

    if (this.isPupaModalViewportBoundaryPositionStrategy(this.overlayRef.getConfig().positionStrategy)) {
      return 0;
    }

    switch (this.modalRef.getOverlayYPosition()) {
      case 'center':
        return targetClientRect.height / 2;
      case 'bottom':
        return targetClientRect.height;
      case 'top':
      default:
        return 0;
    }
  }
}
