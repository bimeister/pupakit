import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-popover-layout-title',
  templateUrl: './popover-layout-title.component.html',
  styleUrls: ['./popover-layout-title.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverLayoutTitleComponent {}
