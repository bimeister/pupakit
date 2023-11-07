import { CdkVirtualScrollViewport, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarVirtualScrollStrategy } from '../../../../declarations/classes/calendar-virtual-scroll-strategy.class';
import { MONTHS_IN_YEAR } from '../../../../declarations/constants/months-in-year.const';
import { DayOfWeek } from '../../../../declarations/enums/day-of-week.enum';
import { MonthIndex } from '../../../../declarations/enums/month-index.enum';
import { CalendarMonth } from '../../../../declarations/interfaces/calendar-month.interface';
import { CalendarTranslation } from '../../../../declarations/interfaces/calendar-translation.interface';
import { CalendarConfigService } from '../../services/calendar-config.service';
import { CalendarManipulatorService } from '../../services/calendar-manipulator.service';
import { CalendarStateService } from '../../services/calendar-state.service';
import { CalendarTranslationService } from '../../services/calendar-translation.service';

export function calendarVirtualScrollStrategyFactory({
  virtualScrollConfig,
}: CalendarConfigService): CalendarVirtualScrollStrategy {
  return new CalendarVirtualScrollStrategy(virtualScrollConfig);
}

@Component({
  selector: 'pupa-calendar-scroller',
  templateUrl: './calendar-scroller.component.html',
  styleUrls: ['./calendar-scroller.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: VIRTUAL_SCROLL_STRATEGY,
      useFactory: calendarVirtualScrollStrategyFactory,
      deps: [CalendarConfigService],
    },
  ],
})
export class CalendarScrollerComponent implements AfterViewInit {
  @ViewChild(CdkVirtualScrollViewport)
  private readonly virtualScrollViewport: CdkVirtualScrollViewport;

  public readonly calendarMonths: CalendarMonth[] = Array.from(
    { length: this.calendarConfigService.yearsRange * MONTHS_IN_YEAR },
    (_: unknown, monthGlobalIndex: number) => this.getCalendarMonthByMonthGlobalIndex(monthGlobalIndex)
  );

  public readonly monthNameByIndex$: Observable<Record<MonthIndex, string>> =
    this.calendarTranslationService.translation$.pipe(map((translation: CalendarTranslation) => translation.months));

  public readonly selectedDates$: Observable<Date[]> = this.calendarStateService.selectedDates$;

  public readonly startWeekday: DayOfWeek = this.calendarConfigService.startWeekday;

  constructor(
    private readonly calendarConfigService: CalendarConfigService,
    private readonly calendarTranslationService: CalendarTranslationService,
    private readonly calendarManipulatorService: CalendarManipulatorService,
    private readonly calendarStateService: CalendarStateService
  ) {}

  public ngAfterViewInit(): void {
    this.calendarManipulatorService.setVirtualScrollViewport(this.virtualScrollViewport);
    this.calendarManipulatorService.resetScroll('auto');
  }

  public addSelectedDate(date: Date): void {
    this.calendarStateService.addSelectedDate(date);
  }

  private getCalendarMonthByMonthGlobalIndex(index: number): CalendarMonth {
    return {
      year: Math.floor(index / MONTHS_IN_YEAR) + this.calendarConfigService.startYear,
      month: index % MONTHS_IN_YEAR,
    };
  }
}
