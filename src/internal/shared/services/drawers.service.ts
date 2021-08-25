import { Overlay } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable, Injector, RendererFactory2 } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { DrawerRef } from '../../declarations/classes/drawer-ref.class';
import { Drawer } from '../../declarations/classes/drawer.class';
import { DrawerConfigDto } from '../../declarations/classes/dto/drawer-config.dto';
import { DrawerConfig } from '../../declarations/interfaces/drawer-config.interface';
import { OpenedDrawer } from '../../declarations/interfaces/opened-drawer.interface';
import { PortalLayersService } from './portal-layers.service';

@Injectable({
  providedIn: 'root'
})
export class DrawersService {
  protected readonly drawerRefs: Map<string, DrawerRef<unknown>> = new Map();

  public get openedCount(): number {
    return this.drawerRefs.size;
  }

  constructor(
    protected readonly overlay: Overlay,
    protected readonly injector: Injector,
    private readonly rendererFactory: RendererFactory2,
    private readonly portalLayersService: PortalLayersService
  ) {}

  public open<ComponentT, ReturnDataT = null>(
    component: ComponentType<ComponentT>,
    config: Partial<DrawerConfig> = null
  ): OpenedDrawer<ReturnDataT> {
    const configDto: DrawerConfigDto = new DrawerConfigDto(config);

    const drawer: Drawer<ComponentT> = new Drawer(
      component,
      configDto,
      this.overlay,
      this.injector,
      this.rendererFactory
    );
    this.portalLayersService.register(drawer);
    this.portalLayersService.moveToTopById(drawer.id);

    const drawerRef: DrawerRef<ReturnDataT> = drawer.open();
    this.drawerRefs.set(drawer.id, drawerRef);

    drawerRef.closed$.subscribe(() => {
      this.portalLayersService.removeById(drawer.id);
      this.drawerRefs.delete(drawer.id);
    });

    return {
      id: drawer.id,
      closed$: drawerRef.closed$
    };
  }

  public closeById(id: string): void {
    const drawerRef: DrawerRef<unknown> = this.drawerRefs.get(id);

    if (isNil(drawerRef)) {
      return;
    }

    drawerRef.close(null);
  }

  public closeAll(): void {
    this.drawerRefs.forEach((drawerRef: DrawerRef<unknown>) => drawerRef.close(null));
  }
}
