import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pupa-calendar-cell-empty',
  templateUrl: './calendar-cell-empty.component.html',
  styleUrls: ['./calendar-cell-empty.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarCellEmptyComponent {
  @Input()
  public isInRange: boolean = false;
}
