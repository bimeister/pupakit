import { Overlay } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { isNil } from '@bimeister/utilities';
import { DrawerRef } from '../../../../internal/declarations/classes/drawer-ref.class';
import { Drawer } from '../../../../internal/declarations/classes/drawer.class';
import { DrawerConfigDto } from '../../../../internal/declarations/classes/dto/drawer-config.dto';
import { DrawerConfig } from '../../../../internal/declarations/interfaces/drawer-config.interface';
import { OpenedDrawer } from '../../../../internal/declarations/interfaces/opened-drawer.interface';

@Injectable({
  providedIn: 'root'
})
export class DrawersService {
  protected readonly drawerRefs: Map<string, DrawerRef<unknown>> = new Map();

  public get openedCount(): number {
    return this.drawerRefs.size;
  }

  constructor(protected readonly overlay: Overlay, protected readonly injector: Injector) {}

  public open<ComponentT, ReturnDataT = null>(
    component: ComponentType<ComponentT>,
    config: Partial<DrawerConfig> = null
  ): OpenedDrawer<ReturnDataT> {
    const configDto: DrawerConfigDto = new DrawerConfigDto(config);

    const drawer: Drawer<ComponentT> = new Drawer(component, configDto, this.overlay, this.injector);
    const drawerRef: DrawerRef<ReturnDataT> = drawer.open();

    this.drawerRefs.set(drawer.getId(), drawerRef);

    drawerRef.closed$.subscribe(() => this.drawerRefs.delete(drawer.getId()));

    return {
      id: drawer.getId(),
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
