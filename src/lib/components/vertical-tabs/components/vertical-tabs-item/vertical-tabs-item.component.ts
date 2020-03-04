import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-vertical-tabs-item',
  templateUrl: './vertical-tabs-item.component.html',
  styleUrls: ['./vertical-tabs-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalTabsItemComponent {}
