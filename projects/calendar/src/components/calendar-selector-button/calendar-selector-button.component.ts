import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-calendar-selector-button',
  templateUrl: './calendar-selector-button.component.html',
  styleUrls: ['./calendar-selector-button.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarSelectorButtonComponent {
  @Input() public isCurrent: boolean = false;
}
