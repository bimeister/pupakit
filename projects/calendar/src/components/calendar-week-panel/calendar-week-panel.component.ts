import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { isEmpty } from '@bimeister/utilities';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DAYS_IN_WEEK } from '../../declarations/constants/days-in-week.const';
import { DayOfWeek } from '../../declarations/enums/day-of-week.enum';
import { CalendarTranslation } from '../../declarations/interfaces/calendar-translation.interface';
import { CalendarConfigService } from '../../services/calendar-config.service';
import { CalendarTranslationService } from '../../services/calendar-translation.service';

function getWeekdaysInOrderByWeekStart(weekStart: DayOfWeek): DayOfWeek[] {
  return Array.from({ length: DAYS_IN_WEEK }).map((_: unknown, defaultWeekday: DayOfWeek) => {
    if (defaultWeekday === DayOfWeek.Sunday) {
      return weekStart;
    }

    const nextWeekday: DayOfWeek = Number(defaultWeekday) + Number(weekStart);

    return nextWeekday >= DAYS_IN_WEEK ? nextWeekday % DAYS_IN_WEEK : nextWeekday;
  });
}

@Component({
  selector: 'pupa-calendar-week-panel',
  templateUrl: './calendar-week-panel.component.html',
  styleUrls: ['./calendar-week-panel.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarWeekPanelComponent {
  public readonly weekdays$: Observable<string[]> = this.calendarTranslationService.translation$.pipe(
    map(({ weekdays }: CalendarTranslation) => {
      if (isEmpty(weekdays)) {
        throwError(`No translation for weekdays`);
      }

      const weekdaysInOrder: DayOfWeek[] = getWeekdaysInOrderByWeekStart(this.calendarConfigService.startWeekday);

      return weekdaysInOrder.map((day: DayOfWeek) => weekdays[day]);
    })
  );

  constructor(
    private readonly calendarTranslationService: CalendarTranslationService,
    private readonly calendarConfigService: CalendarConfigService
  ) {}
}
