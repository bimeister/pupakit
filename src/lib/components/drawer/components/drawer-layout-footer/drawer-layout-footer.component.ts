import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-drawer-layout-footer',
  templateUrl: './drawer-layout-footer.component.html',
  styleUrls: ['./drawer-layout-footer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerLayoutFooterComponent {}
