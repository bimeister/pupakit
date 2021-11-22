import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';
import { Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { getUuid, isNil } from '@bimeister/utilities';
import { DrawerContainerNewComponent } from '../../../lib/components/drawer-new/components/drawer-container-new/drawer-container-new.component';
import { DRAWER_CONTAINER_DATA_TOKEN } from '../../constants/tokens/drawer-container-data.token';
import { DrawerConfig } from '../interfaces/drawer-config.interface';
import { DrawerContainerData } from '../interfaces/drawer-container-data.interface';
import { DrawerRef } from './drawer-ref.class';
import { PortalLayer } from '../interfaces/portal-layer.interface';
import { DrawerLayoutConfig } from '../interfaces/drawer-layout-config.interface';
import { DRAWER_LAYOUT_CONFIG_TOKEN } from '../../constants/tokens/drawer-layout-data.token';

export class Drawer<ComponentT> implements PortalLayer {
  public readonly id: string;
  private readonly renderer: Renderer2 = this.rendererFactory.createRenderer(null, null);

  private readonly overlayRef: OverlayRef = this.overlay.create({
    positionStrategy: this.getPositionStrategy(),
    hasBackdrop: this.config.hasBackdrop,
    backdropClass: this.getBackdropClass()
  });

  private readonly drawerRef: DrawerRef = new DrawerRef(this.overlayRef);
  private currentZIndex: number = 0;

  constructor(
    private readonly component: ComponentType<ComponentT>,
    private readonly config: DrawerConfig,
    private readonly overlay: Overlay,
    private readonly injector: Injector,
    private readonly rendererFactory: RendererFactory2
  ) {
    this.id = getUuid();
    this.handleBackdropClick();
  }

  public open(): DrawerRef {
    this.overlayRef.attach(this.getComponentPortal());
    return this.drawerRef;
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
  }

  private getComponentPortal(): ComponentPortal<DrawerContainerNewComponent<unknown>> {
    const portalInjector: PortalInjector = this.createDrawerContainerInjector();
    return new ComponentPortal(DrawerContainerNewComponent, null, portalInjector);
  }

  private createDrawerContainerInjector(): PortalInjector {
    const contentComponentPortal: ComponentPortal<ComponentT> = this.createDrawerContentComponentPortal();

    const drawerContainerData: DrawerContainerData<ComponentT> = {
      contentComponentPortal,
      ...this.createDrawerLayoutConfig()
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
    injectionTokens.set(DRAWER_LAYOUT_CONFIG_TOKEN, this.createDrawerLayoutConfig());

    const parentInjector: Injector = this.getParentInjector();
    return new PortalInjector(parentInjector, injectionTokens);
  }

  private createDrawerLayoutConfig(): DrawerLayoutConfig {
    return {
      float: this.config.float,
      hasBackdrop: this.config.hasBackdrop,
      hasPadding: this.config.hasPadding ?? true
    };
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

  private getBackdropClass(): string {
    if (this.config.hasBackdrop) {
      return this.config.isBackdropTransparent ? 'cdk-overlay-transparent-backdrop' : 'cdk-overlay-dark-backdrop';
    }

    return 'cdk-overlay-without-backdrop';
  }
}
