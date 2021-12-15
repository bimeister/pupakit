import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-select-dropdown-header',
  templateUrl: './select-dropdown-header.component.html',
  styleUrls: ['./select-dropdown-header.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectDropdownHeaderComponent {}
