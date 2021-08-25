import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-dropdown-menu-separator',
  templateUrl: './dropdown-menu-separator.component.html',
  styleUrls: ['./dropdown-menu-separator.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownMenuSeparatorComponent {}
