import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-select-dropdown-footer',
  templateUrl: './select-dropdown-footer.component.html',
  styleUrls: ['./select-dropdown-footer.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectDropdownFooterComponent {}
