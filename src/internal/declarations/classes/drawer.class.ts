import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';
import { Injector } from '@angular/core';
import { getUuid, isNil } from '@bimeister/utilities/common';
import { DrawerContainerComponent } from '../../../lib/components/drawer/components/drawer-container/drawer-container.component';
import { DRAWER_CONTAINER_DATA_TOKEN } from '../../constants/tokens/drawer-container-data.token';
import { DrawerConfig } from '../interfaces/drawer-config.interface';
import { DrawerContainerData } from '../interfaces/drawer-container-data.interface';
import { DrawerRef } from './drawer-ref.class';

export class Drawer<ComponentT> {
  private readonly id: string;

  private readonly overlayRef: OverlayRef = this.overlay.create({
    positionStrategy: this.getPositionStrategy(),
    hasBackdrop: this.config.hasBackdrop,
    backdropClass: this.config.isBackdropTransparent ? 'cdk-overlay-transparent-backdrop' : 'cdk-overlay-dark-backdrop'
  });

  private readonly drawerRef: DrawerRef = new DrawerRef(this.overlayRef);

  constructor(
    private readonly component: ComponentType<ComponentT>,
    private readonly config: DrawerConfig,
    private readonly overlay: Overlay,
    private readonly injector: Injector
  ) {
    this.id = getUuid();
    this.handleBackdropClick();
  }

  public open(): DrawerRef {
    this.overlayRef.attach(this.getComponentPortal());
    return this.drawerRef;
  }

  public getId(): string {
    return this.id;
  }

  private getComponentPortal(): ComponentPortal<DrawerContainerComponent<unknown>> {
    const portalInjector: PortalInjector = this.createDrawerContainerInjector();
    return new ComponentPortal(DrawerContainerComponent, null, portalInjector);
  }

  private createDrawerContainerInjector(): PortalInjector {
    const contentComponentPortal: ComponentPortal<ComponentT> = this.createDrawerContentComponentPortal();

    const drawerContainerData: DrawerContainerData<ComponentT> = {
      contentComponentPortal,
      float: this.config.float
    };

    const injectionTokens: WeakMap<object, any> = new WeakMap();
    injectionTokens.set(DRAWER_CONTAINER_DATA_TOKEN, drawerContainerData);

    return new PortalInjector(this.injector, injectionTokens);
  }

  private createDrawerContentComponentPortal(): ComponentPortal<ComponentT> {
    const drawerContentInjector: PortalInjector = this.createDrawerContentInjector();
    return new ComponentPortal(this.component, null, drawerContentInjector);
  }

  private createDrawerContentInjector(): PortalInjector {
    const injectionTokens: WeakMap<object, any> = new WeakMap();

    injectionTokens.set(DrawerRef, this.drawerRef);

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

  private getPositionStrategy(): PositionStrategy {
    return this.overlay.position().global();
  }

  private handleBackdropClick(): void {
    if (!this.config.closeOnBackdropClick) {
      return;
    }
    this.overlayRef.backdropClick().subscribe(() => this.drawerRef.close());
  }
}
