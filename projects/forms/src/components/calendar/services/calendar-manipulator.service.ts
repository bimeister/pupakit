import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Injectable } from '@angular/core';
import { filterNotNil, filterTruthy, isNil, shareReplayWithRefCount } from '@bimeister/utilities';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith, switchMap, take } from 'rxjs/operators';
import { MONTHS_IN_YEAR } from '../../../declarations/constants/months-in-year.const';
import { MonthIndex } from '../../../declarations/enums/month-index.enum';
import { CalendarMonth } from '../../../declarations/interfaces/calendar-month.interface';
import { CalendarConfigService } from './calendar-config.service';

@Injectable()
export class CalendarManipulatorService {
  private readonly virtualScrollViewport$: BehaviorSubject<CdkVirtualScrollViewport | null> =
    new BehaviorSubject<CdkVirtualScrollViewport | null>(null);

  private readonly currentIndex$: Observable<number> = this.virtualScrollViewport$.pipe(
    filterNotNil(),
    switchMap((viewport: CdkVirtualScrollViewport) => viewport.scrolledIndexChange),
    shareReplayWithRefCount()
  );

  private readonly virtualScrollInitialized$: Observable<boolean> = this.currentIndex$.pipe(
    map(() => true),
    startWith(false),
    shareReplayWithRefCount()
  );

  public readonly currentCalendarMonth$: Observable<CalendarMonth> = this.currentIndex$.pipe(
    map((currentIndex: number) => {
      const monthIndex: MonthIndex = currentIndex % MONTHS_IN_YEAR;
      const yearsCount: number = (currentIndex - monthIndex) / MONTHS_IN_YEAR;

      return {
        year: yearsCount + this.calendarConfigService.startYear,
        month: monthIndex,
      };
    })
  );

  private get initialCalendarMonth(): CalendarMonth {
    const currentDate: Date = new Date();

    return {
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
    };
  }

  private get initialMonthIndex(): number {
    const initialCalendarMonth: CalendarMonth = this.initialCalendarMonth;

    return (
      (initialCalendarMonth.year - this.calendarConfigService.startYear) * MONTHS_IN_YEAR +
      Number(initialCalendarMonth.month)
    );
  }

  constructor(private readonly calendarConfigService: CalendarConfigService) {}

  public setVirtualScrollViewport(viewport: CdkVirtualScrollViewport): void {
    if (isNil(viewport)) {
      throw new Error('[CalendarStateService] viewport can not be null or undefined');
    }

    this.virtualScrollViewport$.next(viewport);
  }

  public clearVirtualScrollViewport(): void {
    this.virtualScrollViewport$.next(null);
  }

  public resetScroll(behavior: ScrollBehavior): void {
    this.scrollToMonthByIndex(this.initialMonthIndex, behavior);
  }

  public scrollToYear(year: number, behavior: ScrollBehavior): void {
    const yearFirstMonthIndex: number = (year - this.calendarConfigService.startYear) * MONTHS_IN_YEAR;

    this.scrollToMonthByIndex(yearFirstMonthIndex, behavior);
  }

  public scrollToMonth(calendarMonth: CalendarMonth, behavior: ScrollBehavior): void {
    const monthIndex: number =
      (calendarMonth.year - this.calendarConfigService.startYear) * MONTHS_IN_YEAR + Number(calendarMonth.month);

    this.scrollToMonthByIndex(monthIndex, behavior);
  }

  public scrollToNextMonth(behavior: ScrollBehavior): void {
    this.currentIndex$.pipe(take(1)).subscribe((currentIndex: number) => {
      this.scrollToMonthByIndex(currentIndex + 1, behavior);
    });
  }

  public scrollToPreviousMonth(behavior: ScrollBehavior): void {
    this.currentIndex$.pipe(take(1)).subscribe((currentIndex: number) => {
      this.scrollToMonthByIndex(currentIndex - 1, behavior);
    });
  }

  public scrollToMonthByIndex(index: number, behavior: ScrollBehavior): void {
    this.virtualScrollInitialized$
      .pipe(
        filterTruthy(),
        switchMap(() => this.virtualScrollViewport$),
        take(1)
      )
      .subscribe((viewport: CdkVirtualScrollViewport) =>
        requestAnimationFrame(() => viewport.scrollToIndex(index, behavior))
      );
  }
}
