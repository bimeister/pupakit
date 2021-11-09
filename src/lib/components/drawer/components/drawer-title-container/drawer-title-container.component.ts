import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-drawer-title-container',
  templateUrl: './drawer-title-container.component.html',
  styleUrls: ['./drawer-title-container.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerTitleContainerComponent {}
