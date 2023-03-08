import { ListRange } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport, VirtualScrollStrategy } from '@angular/cdk/scrolling';
import { isNil, shareReplayWithRefCount } from '@bimeister/utilities';
import { Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { MONTHS_IN_YEAR } from '../constants/months-in-year.const';
import { SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS } from '../constants/small-calendar-cycle-size-in-years.const';
import { MonthIndex } from '../enums/month-index.enum';
import { getHeightForEachMonthInCalendarCycle } from '../functions/get-height-for-each-month-in-calendar-cycle.function';
import { CalendarVirtualScrollConfig } from '../interfaces/calendar-virtual-scroll-config.interface';

export class CalendarVirtualScrollStrategy implements VirtualScrollStrategy {
  private readonly index$: Subject<number> = new Subject<number>();

  private readonly cycleIndex$: Observable<number> = this.index$.pipe(
    distinctUntilChanged(),
    map((index: number) => {
      const yearIndex: number = Math.floor(index / MONTHS_IN_YEAR);

      return Math.floor(yearIndex / SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS);
    }),
    distinctUntilChanged()
  );

  private viewport: CdkVirtualScrollViewport | null = null;

  private cycleHeight: number;

  public readonly scrolledIndexChange: Observable<number> = this.index$.pipe(
    distinctUntilChanged(),
    shareReplayWithRefCount()
  );

  private cycleMonthsHeights: readonly (readonly number[])[] = this.getCycleMonthHeights(0);

  private readonly subscription: Subscription = new Subscription();

  constructor(private readonly config: CalendarVirtualScrollConfig) {
    this.cycleHeight = CalendarVirtualScrollStrategy.getDistanceToMonthInCycle(this.cycleMonthsHeights);
  }

  public attach(viewport: CdkVirtualScrollViewport): void {
    this.viewport = viewport;
    this.viewport.setTotalContentSize(this.getViewportHeight(this.cycleHeight, this.config.yearsRange));
    this.updateRenderedRange(this.viewport);
    this.subscription.add(this.updateCycleMonthHeightsWhenCycleIndexChanged());
  }

  public detach(): void {
    this.index$.complete();
    this.viewport = null;
    this.subscription.unsubscribe();
  }

  public onContentScrolled(): void {
    if (isNil(this.viewport)) {
      return;
    }

    this.updateRenderedRange(this.viewport);
  }

  public scrollToIndex(index: number, behavior: ScrollBehavior): void {
    if (isNil(this.viewport)) {
      return;
    }

    const scrollOffset: number = this.getOffsetForIndex(index);

    this.viewport.scrollToOffset(scrollOffset, behavior);
  }

  public onDataLengthChanged(): void {
    // not needed
  }
  public onContentRendered(): void {
    // not needed
  }
  public onRenderedOffsetChanged(): void {
    // not needed
  }

  private getOffsetForIndex(index: number): number {
    const monthIndex: number = index % MONTHS_IN_YEAR;
    const year: number = (index - monthIndex) / MONTHS_IN_YEAR;

    return this.getDistanceToMonthInScroll(year, monthIndex);
  }

  private getIndexForOffset(offset: number): number {
    const remainderHeight: number = offset % this.cycleHeight;

    const scrolledYearsCount: number =
      ((offset - remainderHeight) / this.cycleHeight) * SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS;

    let reminderHeightAccumulator: number = 0;
    for (let yearIndex: number = 0; yearIndex < SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS; yearIndex++) {
      for (let monthIndex: number = 0; monthIndex < MONTHS_IN_YEAR; monthIndex++) {
        reminderHeightAccumulator += this.cycleMonthsHeights[yearIndex][monthIndex];

        const isEndMonth: boolean = reminderHeightAccumulator > remainderHeight;

        if (isEndMonth) {
          return (scrolledYearsCount + yearIndex) * MONTHS_IN_YEAR + monthIndex;
        }
      }
    }

    return this.config.yearsRange;
  }

  private updateRenderedRange(viewport: CdkVirtualScrollViewport): void {
    const offset: number = viewport.measureScrollOffset();

    const { start, end }: ListRange = viewport.getRenderedRange();

    const newRange: ListRange = { start, end };

    const firstVisibleIndex: number = this.getIndexForOffset(offset);

    const startOffset: number = offset - this.getOffsetForIndex(start);

    if (startOffset < this.config.bufferPx && start !== 0) {
      newRange.start = this.getRangeStartByOffset(offset, 2);
      newRange.end = this.getRangeEndByOffset(offset);
    } else {
      const endOffset: number = this.getOffsetForIndex(end) - offset - viewport.getViewportSize();

      if (endOffset < this.config.bufferPx && end !== viewport.getDataLength()) {
        newRange.start = this.getRangeStartByOffset(offset);
        newRange.end = this.getRangeEndByOffset(offset, 2);
      }
    }

    viewport.setRenderedRange(newRange);
    viewport.setRenderedContentOffset(this.getOffsetForIndex(newRange.start));

    this.index$.next(firstVisibleIndex);
  }

  private getRangeStartByOffset(offset: number, bufferFactor: number = 1): number {
    return Math.max(0, this.getIndexForOffset(offset - this.config.bufferPx * bufferFactor));
  }

  private getRangeEndByOffset(offset: number, bufferFactor: number = 1): number {
    return Math.min(
      this.viewport.getDataLength(),
      this.getIndexForOffset(offset + this.viewport.getViewportSize() + this.config.bufferPx * bufferFactor)
    );
  }

  private getDistanceToMonthInScroll(year: number, monthIndex?: number): number {
    const remainderYear: number = year % SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS;

    const remainderHeight: number = CalendarVirtualScrollStrategy.getDistanceToMonthInCycle(
      this.cycleMonthsHeights,
      remainderYear,
      monthIndex
    );

    const fullCyclesCount: number = (year - remainderYear) / SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS;

    const fullCyclesHeight: number = fullCyclesCount * this.cycleHeight;

    const distanceToMonth: number = fullCyclesHeight + remainderHeight;

    return year === 0 ? distanceToMonth : distanceToMonth + this.config.dividerHeightPx;
  }

  private updateCycleMonthHeightsWhenCycleIndexChanged(): Subscription {
    return this.cycleIndex$.subscribe((cycleIndex: number) => {
      this.cycleMonthsHeights = this.getCycleMonthHeights(cycleIndex);
      this.cycleHeight = CalendarVirtualScrollStrategy.getDistanceToMonthInCycle(this.cycleMonthsHeights);
      this.viewport.setTotalContentSize(this.getViewportHeight(this.cycleHeight, this.config.yearsRange));
    });
  }

  private getCycleMonthHeights(cycleIndex: number): readonly (readonly number[])[] {
    const startYear: number = this.config.startYear + cycleIndex * SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS;

    return getHeightForEachMonthInCalendarCycle({
      labelHeightPx: this.config.labelHeightPx,
      weekHeightPx: this.config.weekHeightPx,
      dividerHeightPx: this.config.dividerHeightPx,
      startWeekday: this.config.startWeekday,
      startYear,
    });
  }

  private getViewportHeight(cycleHeight: number, yearsRange: number): number {
    return (
      cycleHeight * Math.ceil(yearsRange / SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS) -
      this.config.labelHeightPx -
      this.config.dividerHeightPx * 2
    );
  }

  private static getDistanceToMonthInCycle(
    cycle: readonly (readonly number[])[],
    lastYear: number = SMALL_CALENDAR_CYCLE_SIZE_IN_YEARS,
    lastMonthIndex: MonthIndex = MonthIndex.December
  ): number {
    return cycle.reduce((total: number, year: readonly number[], yearIndex: number) => {
      if (yearIndex > lastYear) {
        return total;
      }

      const yearHeight: number = year.reduce((sum: number, monthHeight: number, monthIndex: MonthIndex) => {
        const isBeforeTargetMonth: boolean = yearIndex < lastYear || monthIndex < lastMonthIndex;

        return isBeforeTargetMonth ? sum + monthHeight : sum;
      }, 0);

      return total + yearHeight;
    }, 0);
  }
}
