import { Component, Injector } from '@angular/core';
import { Theme } from '@kit/internal/declarations/enums/theme.enum';
import { OpenedDrawer } from '@kit/internal/declarations/interfaces/opened-drawer.interface';
import { DrawersService } from '@kit/internal/shared/services/drawers.service';
import { DrawerContainerComponent } from '@kit/lib/components/drawer/components/drawer-container/drawer-container.component';
import { ThemeWrapperService } from '@kit/lib/components/theme-wrapper/services/theme-wrapper.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { DRAWER_DATA_TOKEN } from '../../../../../../declarations/tokens/drawer-data.token';
import { DrawerLayoutExample1Component } from '../drawer-layout-example-1/drawer-layout-example-1.component';

@Component({
  selector: 'demo-drawer-trigger-example-1',
  templateUrl: './drawer-trigger-example-1.component.html',
  styleUrls: ['./drawer-trigger-example-1.component.scss'],
})
export class DrawerTriggerExample1Component {
  public drawerCloseMessage$: Observable<string>;

  constructor(
    private readonly drawerService: DrawersService,
    private readonly injector: Injector,
    private readonly themeWrapperService: ThemeWrapperService
  ) {}

  public openDrawer(): void {
    this.themeWrapperService.theme$.pipe(take(1)).subscribe((theme: Theme) => {
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
        theme,
      });

      this.drawerCloseMessage$ = drawer.closed$;
    });
  }
}
