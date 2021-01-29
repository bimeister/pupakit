import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';
import { Injector } from '@angular/core';
import { getUuid, isNil } from '@bimeister/utilities/commonjs/common';
import { ModalContainerComponent } from '../../../lib/components/modal/components/modal-container/modal-container.component';
import { MODAL_CONTAINER_DATA_TOKEN } from '../../constants/tokens/modal-container-data.token';
import { ModalConfig } from '../interfaces/modal-config.interface';
import { ModalContainerData } from '../interfaces/modal-container-data.interface';
import { Position } from '../types/position.type';
import { ModalRef } from './modal-ref.class';

export class Modal<ComponentT> {
  private readonly id: string;

  private readonly overlayRef: OverlayRef = this.overlay.create({
    positionStrategy: this.getPositionStrategy(),
    hasBackdrop: this.config.hasBackdrop,
    backdropClass: this.config.isBackdropTransparent ? 'cdk-overlay-transparent-backdrop' : 'cdk-overlay-dark-backdrop'
  });

  private readonly modalRef: ModalRef = new ModalRef(this.overlayRef);

  constructor(
    private readonly component: ComponentType<ComponentT>,
    private readonly config: ModalConfig,
    private readonly overlay: Overlay,
    private readonly injector: Injector
  ) {
    this.id = getUuid();
    this.handleBackdropClick();
  }

  public open(): ModalRef {
    this.overlayRef.attach(this.getComponentPortal());
    return this.modalRef;
  }

  public getId(): string {
    return this.id;
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
          overlayX: 'start',
          overlayY: 'top'
        }
      ]);
  }

  private getComponentPortal(): ComponentPortal<ModalContainerComponent<unknown>> {
    const portalInjector: PortalInjector = this.createModalContainerInjector();

    return new ComponentPortal(ModalContainerComponent, null, portalInjector);
  }

  private createModalContainerInjector(): PortalInjector {
    const contentComponentPortal: ComponentPortal<ComponentT> = this.createModalContentCOmponentPortal();

    const modalContainerData: ModalContainerData<ComponentT> = {
      contentComponentPortal
    };

    const injectionTokens: WeakMap<object, any> = new WeakMap();
    injectionTokens.set(MODAL_CONTAINER_DATA_TOKEN, modalContainerData);

    return new PortalInjector(this.injector, injectionTokens);
  }

  private createModalContentCOmponentPortal(): ComponentPortal<ComponentT> {
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
        parent: this.injector
      });
    }

    return Injector.create({
      providers: this.config.providers,
      parent: this.config.injector
    });
  }

  private handleBackdropClick(): void {
    if (!this.config.closeOnBackdropClick) {
      return;
    }
    this.overlayRef.backdropClick().subscribe(() => this.modalRef.close());
  }
}
