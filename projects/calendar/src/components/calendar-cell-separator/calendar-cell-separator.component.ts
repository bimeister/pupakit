import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-calendar-cell-separator',
  templateUrl: './calendar-cell-separator.component.html',
  styleUrls: ['./calendar-cell-separator.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarCellSeparatorComponent {
  @Input()
  public isInRange: boolean = false;
}
