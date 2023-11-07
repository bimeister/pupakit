import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'demo-calendar-example-4',
  templateUrl: './example-4.component.html',
  styleUrls: ['./example-4.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Example4Component {
  public dateTime: string = 'dateTime';

  public selectedDate: Date = new Date();

  public selectDate(dates: Date[]): void {
    this.selectedDate = dates[0];
  }
}
