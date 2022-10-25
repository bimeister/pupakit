import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { DRAWER_LAYOUT_CONFIG_TOKEN } from '../../../../declarations/tokens/drawer-layout-data.token';
import { DrawerLayoutConfig } from '../../../../declarations/interfaces/drawer-layout-config.interface';

@Component({
  selector: 'pupa-drawer-layout',
  templateUrl: './drawer-layout.component.html',
  styleUrls: ['./drawer-layout.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerLayoutComponent {
  public get hasShadow(): boolean {
    return !this.drawerLayoutConfig.hasBackdrop;
  }

  constructor(@Inject(DRAWER_LAYOUT_CONFIG_TOKEN) private readonly drawerLayoutConfig: DrawerLayoutConfig) {}
}
