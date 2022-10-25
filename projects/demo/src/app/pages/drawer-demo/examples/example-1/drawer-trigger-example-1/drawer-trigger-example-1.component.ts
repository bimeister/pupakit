import { Component, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { DrawersService, OpenedDrawer, DrawerContainerComponent } from '@bimeister/pupakit.overlays';
import { DRAWER_DATA_TOKEN } from '../../../../../../declarations/tokens/drawer-data.token';
import { DrawerLayoutExample1Component } from '../drawer-layout-example-1/drawer-layout-example-1.component';

@Component({
  selector: 'demo-drawer-trigger-example-1',
  templateUrl: './drawer-trigger-example-1.component.html',
  styleUrls: ['./drawer-trigger-example-1.component.scss'],
})
export class DrawerTriggerExample1Component {
  public drawerCloseMessage$: Observable<string>;

  constructor(private readonly drawerService: DrawersService, private readonly injector: Injector) {}

  public openDrawer(): void {
    const drawer: OpenedDrawer<string> = this.drawerService.open(DrawerLayoutExample1Component, {
      injector: this.injector,
      hasBackdrop: true,
      closeOnBackdropClick: true,
      isBackdropTransparent: false,
      containerComponent: DrawerContainerComponent,
      providers: [
        {
          provide: DRAWER_DATA_TOKEN,
          useValue: [1, 2, 3, 4],
        },
      ],
    });

    this.drawerCloseMessage$ = drawer.closed$;
  }
}
