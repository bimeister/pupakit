import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-dropdown-menu-item-icon',
  templateUrl: './dropdown-menu-item-icon.component.html',
  styleUrls: ['./dropdown-menu-item-icon.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuItemIconComponent {
  @Input() public name: string;
}
