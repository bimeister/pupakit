import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-dropdown-menu-example-1',
  templateUrl: './demo-dropdown-menu-example-1.component.html',
  styleUrls: ['./demo-dropdown-menu-example-1.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuExample1Component {}
