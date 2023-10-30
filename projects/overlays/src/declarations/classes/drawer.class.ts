import { Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, PortalInjector } from '@angular/cdk/portal';
import { Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { getUuid, isNil } from '@bimeister/utilities';
import { DRAWER_CONTAINER_DATA_TOKEN } from '../tokens/drawer-container-data.token';
import { DRAWER_LAYOUT_CONFIG_TOKEN } from '../tokens/drawer-layout-data.token';
import { DrawerConfig } from '../interfaces/drawer-config.interface';
import { DrawerContainerData } from '../interfaces/drawer-container-data.interface';
import { DrawerLayoutConfig } from '../interfaces/drawer-layout-config.interface';
import { DrawerRef } from './drawer-ref.class';
import { PortalLayer } from '../interfaces/portal-layer.interface';

export class Drawer<ContentComponent, ContainerComponent> implements PortalLayer {
  public readonly id: string;
  private readonly renderer: Renderer2 = this.rendererFactory.createRenderer(null, null);

  private readonly overlayRef: OverlayRef = this.overlay.create({
    positionStrategy: this.getPositionStrategy(),
    hasBackdrop: this.config.hasBackdrop,
    backdropClass: this.getBackdropClasses(),
  });

  private readonly drawerRef: DrawerRef = new DrawerRef(this.overlayRef);
  private currentZIndex: number = 0;

  constructor(
    private readonly component: ComponentType<ContentComponent>,
    private readonly config: DrawerConfig<ContainerComponent>,
    private readonly overlay: Overlay,
    private readonly injector: Injector,
    private readonly rendererFactory: RendererFactory2
  ) {
    this.id = getUuid();
    this.handleBackdropClick();
  }

  public open(): DrawerRef {
    if (this.config.isFullscreen) {
      this.drawerRef.changeFullscreenMode(this.config.isFullscreen);
    }

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

    const backdropElement: HTMLElement | null = this.overlayRef.backdropElement;
    if (!isNil(backdropElement)) {
      this.renderer.setStyle(backdropElement, 'z-index', zIndex);
    }
  }

  private getComponentPortal(): ComponentPortal<ContainerComponent> {
    const portalInjector: PortalInjector = this.createDrawerContainerInjector();

    return new ComponentPortal(this.config.containerComponent, null, portalInjector);
  }

  private createDrawerContainerInjector(): PortalInjector {
    const contentComponentPortal: ComponentPortal<ContentComponent> = this.createDrawerContentComponentPortal();

    const drawerContainerData: DrawerContainerData<ContentComponent> = {
      contentComponentPortal,
      ...this.createDrawerLayoutConfig(),
    };

    const injectionTokens: WeakMap<object, any> = new WeakMap();
    injectionTokens.set(DrawerRef, this.drawerRef);
    injectionTokens.set(DRAWER_CONTAINER_DATA_TOKEN, drawerContainerData);

    return new PortalInjector(this.injector, injectionTokens);
  }

  private createDrawerContentComponentPortal(): ComponentPortal<ContentComponent> {
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
      hasPadding: this.config.hasPadding ?? true,
      isFullscreen: this.config.isFullscreen ?? false,
      isMiddlePosition: this.config.isMiddlePosition ?? false,
    };
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

  private getPositionStrategy(): PositionStrategy {
    return this.overlay.position().global();
  }

  private handleBackdropClick(): void {
    if (!this.config.closeOnBackdropClick) {
      return;
    }
    this.overlayRef.backdropClick().subscribe(() => this.drawerRef.close());
  }

  private getBackdropClasses(): string[] {
    const classes: string[] = [];

    if (this.config.hasBackdrop) {
      const backdropClass: string = this.config.isBackdropTransparent
        ? 'cdk-overlay-transparent-backdrop'
        : 'cdk-overlay-dark-backdrop';
      return [...classes, backdropClass];
    }

    return [...classes, 'cdk-overlay-without-backdrop'];
  }
}
