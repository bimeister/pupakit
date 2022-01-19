import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-drawer-layout-stub',
  templateUrl: './drawer-layout-stub.component.html',
  styleUrls: ['./drawer-layout-stub.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerLayoutStubComponent {}
