import { ViewEncapsulation, ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pupa-popover-layout-header',
  templateUrl: './popover-layout-header.component.html',
  styleUrls: ['./popover-layout-header.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverLayoutHeaderComponent {}
