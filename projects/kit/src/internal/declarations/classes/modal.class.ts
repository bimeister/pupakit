import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';
import { Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { getUuid, isNil } from '@bimeister/utilities';
import { ModalContainerComponent } from '../../../lib/components/modal/components/modal-container/modal-container.component';
import { DARK_THEME_CLASS } from '../../constants/dark-theme-class.const';
import { MODAL_CONTAINER_DATA_TOKEN } from '../../constants/tokens/modal-container-data.token';
import { Theme } from '../enums/theme.enum';
import { ModalConfig } from '../interfaces/modal-config.interface';
import { ModalContainerData } from '../interfaces/modal-container-data.interface';
import { PortalLayer } from '../interfaces/portal-layer.interface';
import { Position } from '../types/position.type';
import { ModalRef } from './modal-ref.class';

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

  constructor(
    private readonly component: ComponentType<ComponentT>,
    private readonly config: ModalConfig,
    private readonly overlay: Overlay,
    private readonly injector: Injector,
    private readonly rendererFactory: RendererFactory2
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
    return this.modalRef;
  }

  public updatePosition(position: Position): void {
    this.overlayRef.updatePositionStrategy(this.getModalPositionStrategy(position));
  }

  private getPositionStrategy(): PositionStrategy {
    if (isNil(this.config.position)) {
      return this.overlay.position().global().centerHorizontally().centerVertically();
    }
    return this.getModalPositionStrategy(this.config.position);
  }

  private getModalPositionStrategy(position: Position): PositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo({ x: position[0], y: position[1] })
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
    const portalInjector: PortalInjector = this.createModalContainerInjector();

    return new ComponentPortal(ModalContainerComponent, null, portalInjector);
  }

  private createModalContainerInjector(): PortalInjector {
    const contentComponentPortal: ComponentPortal<ComponentT> = this.createModalContentComponentPortal();

    const modalContainerData: ModalContainerData<ComponentT> = {
      contentComponentPortal,
    };

    const injectionTokens: WeakMap<object, any> = new WeakMap();
    injectionTokens.set(ModalRef, this.modalRef);
    injectionTokens.set(MODAL_CONTAINER_DATA_TOKEN, modalContainerData).set(OverlayRef, this.overlayRef);

    return new PortalInjector(this.injector, injectionTokens);
  }

  private createModalContentComponentPortal(): ComponentPortal<ComponentT> {
    const modalContentInjector: PortalInjector = this.createModalContentInjector();

    return new ComponentPortal(this.component, null, modalContentInjector);
  }

  private createModalContentInjector(): PortalInjector {
    const injectionTokens: WeakMap<object, any> = new WeakMap();
    injectionTokens.set(ModalRef, this.modalRef);

    const parentInjector: Injector = this.getParentInjector();
    return new PortalInjector(parentInjector, injectionTokens);
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
    const classes: string[] = this.config.theme === Theme.Dark ? [DARK_THEME_CLASS] : [];

    if (this.config.hasBackdrop) {
      const backdropClass: string = this.config.isBackdropTransparent
        ? 'cdk-overlay-transparent-backdrop'
        : 'cdk-overlay-dark-backdrop';
      return [...classes, backdropClass];
    }

    return [...classes, 'cdk-overlay-without-backdrop'];
  }
}
