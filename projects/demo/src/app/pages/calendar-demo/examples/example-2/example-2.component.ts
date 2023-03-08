import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DAYS_IN_WEEK } from '@bimeister/pupakit.calendar';

function getNextWeekDate(date: Date): Date {
  const newDate: Date = new Date(date);
  newDate.setDate(date.getDate() + DAYS_IN_WEEK);

  return newDate;
}

@Component({
  selector: 'demo-calendar-example-2',
  templateUrl: './example-2.component.html',
  styleUrls: ['./example-2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Example2Component {
  public selectedDates: Date[] = [new Date(), getNextWeekDate(new Date())];

  public selectDates(dates: Date[]): void {
    this.selectedDates = dates;
  }
}
