import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DAYS_IN_WEEK } from '@bimeister/pupakit.forms';

function getNextWeekDate(date: Date): Date {
  const newDate: Date = new Date(date);
  newDate.setDate(date.getDate() + DAYS_IN_WEEK);

  return newDate;
}

@Component({
  selector: 'demo-calendar-example-5',
  templateUrl: './example-5.component.html',
  styleUrls: ['./example-5.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Example5Component {
  public dateTime: string = 'dateTime';
  public isRange: boolean = true;

  public selectedDates: Date[] = [new Date(), getNextWeekDate(new Date())];

  public selectDates(dates: Date[]): void {
    this.selectedDates = dates;
  }
}
