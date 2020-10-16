import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';

import { OpenedDrawer } from '../../../src/internal/declarations/interfaces/opened-drawer.interface';
import { DrawersService } from '../../../src/public-api';
import { DRAWER_DATA_TOKEN } from '../../declarations/tokens/drawer-data.token';
import { TestDrawerComponent } from './components/test-drawer/test-drawer.component';

@Component({
  selector: 'demo-drawer-demo',
  templateUrl: './drawer-demo.component.html',
  styleUrls: ['./drawer-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerDemoComponent {
  public isDrawerVisible: boolean = false;
  public destroyContentOnClose: boolean = true;
  public withOverlay: boolean = true;
  public floatRight: boolean = true;
  public withDragger: boolean = true;

  constructor(private readonly drawersService: DrawersService, private readonly injector: Injector) {}

  public openDrawer(): void {
    const openedDrawer: OpenedDrawer<number> = this.drawersService.open(TestDrawerComponent, {
      float: 'right',
      hasBackdrop: true,
      closeOnBackdropClick: true,
      isBackdropTransparent: false,
      injector: this.injector,
      providers: [
        {
          provide: DRAWER_DATA_TOKEN,
          useValue: 123123
        }
      ]
    });

    // tslint:disable-next-line: no-console
    openedDrawer.closed$.subscribe((value: number) => console.log(`drawer closed: ${value}`));
  }
}
