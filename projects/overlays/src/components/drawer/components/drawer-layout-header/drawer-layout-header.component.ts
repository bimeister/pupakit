import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-drawer-layout-header',
  templateUrl: './drawer-layout-header.component.html',
  styleUrls: ['./drawer-layout-header.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerLayoutHeaderComponent {}
