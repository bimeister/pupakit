import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-select-new-item',
  templateUrl: './select-new-item.component.html',
  styleUrls: ['./select-new-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectNewItemComponent {}
