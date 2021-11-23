import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-drawer-layout-body',
  templateUrl: './drawer-layout-body.component.html',
  styleUrls: ['./drawer-layout-body.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerLayoutBodyComponent {}
